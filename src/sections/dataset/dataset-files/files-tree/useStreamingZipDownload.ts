import { useCallback, useRef, useState } from 'react'
import { downloadZip } from 'client-zip'
import { md5 } from 'js-md5'
import { FileTreeFile } from '@/files/domain/models/FileTreeItem'
import { useBeforeUnloadGuard } from '@/shared/hooks/useBeforeUnloadGuard'

export type StreamingZipStrategy = 'pause' | 'skip' | 'twopass'

export interface StreamingZipFailure {
  path: string
  name: string
  size: number
  error: string
  recoverable: boolean
}

export interface StreamingZipVerificationFailure {
  path: string
  name: string
  size: number
  algorithm: string
  expected: string
  actual: string
}

export interface StreamingZipState {
  status:
    | 'idle'
    | 'preparing'
    | 'running'
    | 'paused'
    | 'awaiting-retry'
    | 'done'
    | 'error'
    | 'cancelled'
  totalFiles: number
  filesDone: number
  totalBytes: number
  bytesDone: number
  current?: { name: string; path: string; size: number }
  failedSoFar: StreamingZipFailure[]
  verificationFailures: StreamingZipVerificationFailure[]
  pass: 1 | 2
  message?: string
}

export interface StartStreamingZipArgs {
  files: FileTreeFile[]
  zipName?: string
  strategy?: StreamingZipStrategy
  buildFetchUrl?: (file: FileTreeFile) => string
  fetchInit?: RequestInit | FetchInitProvider
  partSize?: number
  partRetries?: number
  partRetryDelayMs?: number
}

const DEFAULT_PART_SIZE_BYTES = 10 * 1024 * 1024
const DEFAULT_PART_RETRIES = 3
const DEFAULT_PART_RETRY_DELAY_MS = 500

export interface StreamingZipApi {
  state: StreamingZipState
  start: (args: StartStreamingZipArgs) => void
  retryCurrent: () => void
  skipCurrent: () => void
  skipAllFailures: () => void
  deferCurrentToEnd: () => void
  retryFailed: () => void
  finalizeRun: () => void
  cancel: () => void
  close: () => void
}

const initialState: StreamingZipState = {
  status: 'idle',
  totalFiles: 0,
  filesDone: 0,
  totalBytes: 0,
  bytesDone: 0,
  failedSoFar: [],
  verificationFailures: [],
  pass: 1
}

interface ResolveBag<T> {
  promise: Promise<T>
  resolve: (value: T) => void
}

function deferred<T>(): ResolveBag<T> {
  let resolve!: (value: T) => void
  const promise = new Promise<T>((r) => {
    resolve = r
  })
  return { promise, resolve }
}

export function useStreamingZipDownload(): StreamingZipApi {
  const [state, setState] = useState<StreamingZipState>(initialState)
  const stateRef = useRef<StreamingZipState>(initialState)
  stateRef.current = state

  useBeforeUnloadGuard(
    state.status === 'preparing' ||
      state.status === 'running' ||
      state.status === 'paused' ||
      state.status === 'awaiting-retry'
  )

  type Decision =
    | 'retry'
    | 'skip'
    | 'skip-all'
    | 'defer-to-end'
    | 'retry-failed'
    | 'finalize'
    | 'cancel'
  const decisionRef = useRef<ResolveBag<Decision> | null>(null)
  const cancelledRef = useRef(false)

  const update = useCallback((fn: (prev: StreamingZipState) => StreamingZipState) => {
    setState((prev) => {
      const next = fn(prev)
      stateRef.current = next
      return next
    })
  }, [])

  const close = useCallback(() => {
    const status = stateRef.current.status
    if (
      status === 'preparing' ||
      status === 'running' ||
      status === 'paused' ||
      status === 'awaiting-retry'
    ) {
      cancelledRef.current = true
      decisionRef.current?.resolve('cancel')
    }
    decisionRef.current = null
    setState(initialState)
    stateRef.current = initialState
  }, [])

  const cancel = useCallback(() => {
    cancelledRef.current = true
    decisionRef.current?.resolve('cancel')
    decisionRef.current = null
    update((prev) => ({ ...prev, status: 'cancelled' }))
  }, [update])

  const sendDecision = useCallback((decision: Decision) => {
    const bag = decisionRef.current
    /* istanbul ignore if */
    if (!bag) return
    decisionRef.current = null
    bag.resolve(decision)
  }, [])

  const retryCurrent = useCallback(() => sendDecision('retry'), [sendDecision])
  const skipCurrent = useCallback(() => sendDecision('skip'), [sendDecision])
  const skipAllFailures = useCallback(() => sendDecision('skip-all'), [sendDecision])
  const deferCurrentToEnd = useCallback(() => sendDecision('defer-to-end'), [sendDecision])
  const retryFailed = useCallback(() => sendDecision('retry-failed'), [sendDecision])
  const finalizeRun = useCallback(() => sendDecision('finalize'), [sendDecision])

  const start = useCallback(
    (args: StartStreamingZipArgs) => {
      const {
        files,
        zipName = 'dataset.zip',
        strategy: initialStrategy = 'pause',
        buildFetchUrl = (f) => f.downloadUrl,
        fetchInit,
        partSize = DEFAULT_PART_SIZE_BYTES,
        partRetries = DEFAULT_PART_RETRIES,
        partRetryDelayMs = DEFAULT_PART_RETRY_DELAY_MS
      } = args
      /* istanbul ignore if */
      if (files.length === 0) return

      cancelledRef.current = false
      decisionRef.current = null
      const getFetchInit: FetchInitProvider =
        typeof fetchInit === 'function' ? fetchInit : () => fetchInit
      const totalBytes = files.reduce((s, f) => s + f.size, 0)
      update(() => ({
        ...initialState,
        status: 'preparing',
        totalFiles: files.length,
        totalBytes,
        pass: 1
      }))

      const queue: FileTreeFile[] = [...files]
      const skippedManifest: StreamingZipFailure[] = []
      let strategy = initialStrategy

      async function* iterableForZip() {
        const processQueue = async function* () {
          while (queue.length > 0) {
            /* istanbul ignore next */
            if (cancelledRef.current) return
            const file = queue.shift() as FileTreeFile
            update((prev) => ({
              ...prev,
              status: 'running',
              current: { name: file.name, path: file.path, size: file.size }
            }))

            const url = buildFetchUrl(file)
            const useRange = file.size > partSize
            const firstPartRange = useRange
              ? `bytes=0-${Math.min(partSize, file.size) - 1}`
              : undefined

            let response: Response
            try {
              response = await fetchWithRetries({
                url,
                rangeHeader: firstPartRange,
                fetchInit: getFetchInit,
                retries: partRetries,
                delayMs: partRetryDelayMs
              })
            } catch (err) {
              const failure: StreamingZipFailure = {
                path: file.path,
                name: file.name,
                size: file.size,
                /* istanbul ignore next */
                error: err instanceof Error ? err.message : String(err),
                recoverable: strategy !== 'skip'
              }
              update((prev) => ({
                ...prev,
                failedSoFar: [...prev.failedSoFar, failure]
              }))
              if (strategy === 'pause') {
                update((prev) => ({ ...prev, status: 'paused' }))
                const decision = await waitForDecision()
                if (decision === 'cancel') return
                if (decision === 'retry') {
                  update((prev) => ({
                    ...prev,
                    failedSoFar: prev.failedSoFar.slice(0, -1),
                    status: 'running'
                  }))
                  queue.unshift(file)
                  continue
                }
                if (decision === 'defer-to-end') {
                  strategy = 'twopass'
                  update((prev) => ({ ...prev, status: 'running' }))
                  continue
                }
                if (decision === 'skip' || decision === 'skip-all') {
                  if (decision === 'skip-all') {
                    strategy = 'skip'
                  }
                  update((prev) => {
                    const last = prev.failedSoFar[prev.failedSoFar.length - 1]
                    /* istanbul ignore if */
                    if (!last) return { ...prev, status: 'running' }
                    return {
                      ...prev,
                      failedSoFar: [
                        ...prev.failedSoFar.slice(0, -1),
                        { ...last, recoverable: false }
                      ],
                      status: 'running'
                    }
                  })
                }
                skippedManifest.push({ ...failure, recoverable: false })
                continue
              }
              if (strategy === 'skip') {
                skippedManifest.push({ ...failure, recoverable: false })
                continue
              }
              continue
            }

            /* istanbul ignore next */
            if (!response.body) {
              update((prev) => ({
                ...prev,
                filesDone: prev.filesDone + 1,
                bytesDone: prev.bytesDone + file.size
              }))
              continue
            }
            const stream = buildChunkedStream({
              file,
              initialResponse: response,
              originalUrl: url,
              partSize,
              partRetries,
              partRetryDelayMs,
              fetchInit: getFetchInit,
              onProgress: (delta) =>
                update((prev) => ({ ...prev, bytesDone: prev.bytesDone + delta })),
              onVerificationFailure: (failure) =>
                update((prev) => ({
                  ...prev,
                  verificationFailures: [...prev.verificationFailures, failure]
                })),
              cancelled: () => cancelledRef.current
            })
            yield {
              name: file.path,
              input: stream,
              lastModified: new Date()
            }
            update((prev) => ({ ...prev, filesDone: prev.filesDone + 1 }))
          }
        }

        yield* processQueue()
        /* istanbul ignore next */
        if (cancelledRef.current) return

        if (strategy === 'twopass' && stateRef.current.failedSoFar.length > 0) {
          update((prev) => ({ ...prev, status: 'awaiting-retry' }))
          const decision = await waitForDecision()
          if (decision === 'cancel') return
          if (decision === 'finalize') {
            for (const f of stateRef.current.failedSoFar.filter((x) => x.recoverable)) {
              skippedManifest.push({ ...f, recoverable: false })
            }
            update((prev) => ({
              ...prev,
              failedSoFar: prev.failedSoFar.map((f) =>
                f.recoverable ? { ...f, recoverable: false } : f
              ),
              status: 'running'
            }))
          } else if (decision === 'retry-failed') {
            const recoverable = stateRef.current.failedSoFar.filter((f) => f.recoverable)
            const fileByPath = new Map(files.map((f) => [f.path, f]))
            for (const f of recoverable) {
              const file = fileByPath.get(f.path)
              if (file) queue.push(file)
            }
            update((prev) => ({
              ...prev,
              failedSoFar: prev.failedSoFar.filter((f) => !f.recoverable),
              pass: 2,
              status: 'running'
            }))
            yield* processQueue()
            const survivors = stateRef.current.failedSoFar.filter((f) => f.recoverable)
            if (survivors.length > 0) {
              for (const f of survivors) skippedManifest.push({ ...f, recoverable: false })
              update((prev) => ({
                ...prev,
                failedSoFar: prev.failedSoFar.map((f) =>
                  f.recoverable ? { ...f, recoverable: false } : f
                )
              }))
            }
          }
        }

        const verifyFails = stateRef.current.verificationFailures
        if (skippedManifest.length > 0 || verifyFails.length > 0) {
          const lines: string[] = []
          if (skippedManifest.length > 0) {
            lines.push('The following files were skipped during this zip download:')
            lines.push('')
            for (const f of skippedManifest) lines.push(`${f.path} — ${f.error}`)
          }
          if (verifyFails.length > 0) {
            if (lines.length > 0) lines.push('')
            lines.push('The following files were downloaded but failed checksum verification.')
            lines.push('Their bytes are in this zip; re-download to confirm integrity:')
            lines.push('')
            for (const v of verifyFails) {
              lines.push(`${v.path} — ${v.algorithm}: expected ${v.expected}, got ${v.actual}`)
            }
          }
          yield {
            name: 'manifest.txt',
            input: new Blob([lines.join('\n')], { type: 'text/plain' }),
            lastModified: new Date()
          }
        }
      }

      async function waitForDecision(): Promise<Decision> {
        const bag = deferred<Decision>()
        decisionRef.current = bag
        return bag.promise
      }

      void (async () => {
        try {
          const response = downloadZip(iterableForZip())
          const blob = await response.blob()
          if (cancelledRef.current) return
          triggerDownload(blob, zipName)
          update((prev) => ({ ...prev, status: 'done', current: undefined }))
        } catch (err) {
          /* istanbul ignore next */
          if (cancelledRef.current) return
          /* istanbul ignore next */
          update((prev) => ({
            ...prev,
            status: 'error',
            message: err instanceof Error ? err.message : String(err)
          }))
        }
      })()
    },
    [update]
  )

  return {
    state,
    start,
    retryCurrent,
    skipCurrent,
    skipAllFailures,
    finalizeRun,
    deferCurrentToEnd,
    retryFailed,
    cancel,
    close
  }
}

class HttpError extends Error {
  constructor(public readonly status: number, statusText: string) {
    super(`HTTP ${status} ${statusText}`)
    this.name = 'HttpError'
  }
}

function isTransientHttpStatus(status: number): boolean {
  if (status >= 500) return true
  return status === 408 || status === 425 || status === 429
}

async function fetchWithRetries(args: {
  url: string
  rangeHeader: string | undefined
  fetchInit: FetchInitProvider
  retries: number
  delayMs: number
}): Promise<Response> {
  let lastErr: unknown = new Error('no attempt made')
  for (let attempt = 0; attempt <= args.retries; attempt++) {
    try {
      const attemptInit = args.fetchInit()
      const headers = new Headers(attemptInit?.headers ?? undefined)
      if (args.rangeHeader !== undefined) headers.set('Range', args.rangeHeader)
      const response = await fetch(args.url, {
        credentials: 'same-origin',
        ...(attemptInit ?? {}),
        headers
      })
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText)
      }
      return response
    } catch (err) {
      lastErr = err
      if (err instanceof HttpError && !isTransientHttpStatus(err.status)) {
        throw err
      }
      if (attempt < args.retries) {
        await new Promise((resolve) => setTimeout(resolve, args.delayMs))
      }
    }
  }
  /* istanbul ignore next */
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}

function appendQueryParam(url: string, key: string, value: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`
}

export type FetchInitProvider = () => RequestInit | undefined

export function initForUrl(
  url: string,
  originalUrl: string,
  init: RequestInit | undefined
): RequestInit | undefined {
  if (!init?.headers) return init
  try {
    if (
      new URL(url, window.location.href).origin ===
      new URL(originalUrl, window.location.href).origin
    ) {
      return init
    }
  } catch {
    /* istanbul ignore next */ return init
  }
  const headers = new Headers(init.headers)
  headers.delete('Authorization')
  return { ...init, headers }
}

async function fetchPartWithRefresh(args: {
  cachedUrl: string
  originalUrl: string
  rangeHeader: string
  fetchInit: FetchInitProvider
  retries: number
  delayMs: number
}): Promise<{ response: Response; refreshedUrl: string | null }> {
  try {
    const response = await fetchWithRetries({
      url: args.cachedUrl,
      rangeHeader: args.rangeHeader,
      fetchInit: () => initForUrl(args.cachedUrl, args.originalUrl, args.fetchInit()),
      retries: args.retries,
      delayMs: args.delayMs
    })
    return { response, refreshedUrl: null }
  } catch (err) {
    if (!(err instanceof HttpError) || err.status !== 403) {
      throw err
    }
    const refreshUrl = appendQueryParam(args.originalUrl, 'gbrecs', 'true')
    const refreshed = await fetchWithRetries({
      url: refreshUrl,
      rangeHeader: args.rangeHeader,
      fetchInit: args.fetchInit,
      retries: args.retries,
      delayMs: args.delayMs
    })
    const newUrl =
      refreshed.url && refreshed.url !== refreshUrl
        ? /* istanbul ignore next */ refreshed.url
        : refreshUrl
    return { response: refreshed, refreshedUrl: newUrl }
  }
}

function makeDigestAccumulator(
  algorithm: string
): { update: (bytes: Uint8Array) => void; finalize: () => Promise<string> } | null {
  const upper = algorithm.toUpperCase()
  if (upper === 'MD5') {
    const hash = md5.create()
    return {
      update: (bytes) => hash.update(bytes),
      finalize: () => Promise.resolve(hash.hex())
    }
  }
  const subtleAlgo =
    upper === 'SHA-1' || upper === 'SHA1'
      ? 'SHA-1'
      : upper === 'SHA-256' || upper === 'SHA256'
      ? 'SHA-256'
      : upper === 'SHA-512' || upper === 'SHA512'
      ? 'SHA-512'
      : null
  if (!subtleAlgo) return null
  const chunks: Uint8Array[] = []
  return {
    update: (bytes) => {
      chunks.push(new Uint8Array(bytes))
    },
    finalize: async () => {
      const total = chunks.reduce((s, c) => s + c.length, 0)
      const buf = new Uint8Array(total)
      let off = 0
      for (const c of chunks) {
        buf.set(c, off)
        off += c.length
      }
      const digest = await window.crypto.subtle.digest(subtleAlgo, buf as BufferSource)
      const out = new Uint8Array(digest)
      let hex = ''
      for (const b of out) hex += b.toString(16).padStart(2, '0')
      return hex
    }
  }
}

function buildChunkedStream(args: {
  file: FileTreeFile
  initialResponse: Response
  originalUrl: string
  partSize: number
  partRetries: number
  partRetryDelayMs: number
  fetchInit: FetchInitProvider
  onProgress: (delta: number) => void
  onVerificationFailure: (failure: StreamingZipVerificationFailure) => void
  cancelled: () => boolean
}): ReadableStream<Uint8Array> {
  const total = args.file.size
  const usedRange = args.initialResponse.status === 206
  const numParts = usedRange ? Math.ceil(total / args.partSize) : 1
  let subsequentUrl =
    args.initialResponse.url && args.initialResponse.url !== args.originalUrl
      ? /* istanbul ignore next */ args.initialResponse.url
      : args.originalUrl

  // /* istanbul ignore next */ guard in the engine), so the assertion
  const initialBody = args.initialResponse.body as ReadableStream<Uint8Array>
  let partIndex = 0
  let currentReader: ReadableStreamDefaultReader<Uint8Array> | null = initialBody.getReader()

  const expectedChecksum = args.file.checksum
  const digest = expectedChecksum ? makeDigestAccumulator(expectedChecksum.type) : null

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (args.cancelled()) {
        /* istanbul ignore next */
        controller.close()
        /* istanbul ignore next */
        return
      }
      for (;;) {
        if (!currentReader) {
          if (partIndex >= numParts) {
            if (digest && expectedChecksum) {
              const actual = await digest.finalize()
              if (actual.toLowerCase() !== expectedChecksum.value.toLowerCase()) {
                args.onVerificationFailure({
                  path: args.file.path,
                  name: args.file.name,
                  size: args.file.size,
                  algorithm: expectedChecksum.type,
                  expected: expectedChecksum.value,
                  actual
                })
              }
            }
            controller.close()
            return
          }
          const start = partIndex * args.partSize
          const end = Math.min(start + args.partSize, total) - 1
          let response: Response
          try {
            const result = await fetchPartWithRefresh({
              cachedUrl: subsequentUrl,
              originalUrl: args.originalUrl,
              rangeHeader: `bytes=${start}-${end}`,
              fetchInit: args.fetchInit,
              retries: args.partRetries,
              delayMs: args.partRetryDelayMs
            })
            response = result.response
            if (result.refreshedUrl) {
              subsequentUrl = result.refreshedUrl
            }
          } catch (err) {
            controller.error(err instanceof Error ? err : new Error(String(err)))
            return
          }
          /* istanbul ignore if */
          if (!response.body) {
            controller.error(new Error('no body for range part'))
            return
          }
          currentReader = response.body.getReader()
        }
        const { value, done } = await currentReader.read()
        if (done) {
          currentReader.releaseLock()
          currentReader = null
          partIndex += 1
          continue
        }
        if (value && value.byteLength > 0) {
          if (digest) digest.update(value)
          args.onProgress(value.byteLength)
          controller.enqueue(value)
          return
        }
      }
    },
    /* istanbul ignore next */
    async cancel() {
      if (currentReader) {
        try {
          await currentReader.cancel()
        } catch {
          return
        }
      }
    }
  })
}

function triggerDownload(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.rel = 'noopener noreferrer'
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 4_000)
}
