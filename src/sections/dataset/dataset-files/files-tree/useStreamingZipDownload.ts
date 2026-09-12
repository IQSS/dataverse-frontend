import { useCallback, useEffect, useRef, useState } from 'react'
import { makeZip } from 'client-zip'
import { md5 } from 'js-md5'
import { sha1 } from '@noble/hashes/legacy.js'
import { sha256, sha512 } from '@noble/hashes/sha2.js'
import { bytesToHex } from '@noble/hashes/utils.js'
import { FileTreeFile } from '@/files/domain/models/FileTreeItem'
import { useBeforeUnloadGuard } from '@/shared/hooks/useBeforeUnloadGuard'
import { ZipSink, resolveZipSink } from './zipStreamSink'
import { checkZipSelectionSize } from './zipDownloadLimits'

export type StreamingZipStrategy = 'pause' | 'skip' | 'twopass'

export interface StreamingZipFailure {
  path: string
  name: string
  size: number
  error: string
  recoverable: boolean
  midEntry?: boolean
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
  serviceWorkerUrl?: string
  sink?: ZipSink
}

const CANCELLED_ERROR = 'download cancelled'

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
  const runIdRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(
    () => () => {
      cancelledRef.current = true
      abortRef.current?.abort()
      decisionRef.current?.resolve('cancel')
    },
    []
  )

  const update = useCallback((fn: (prev: StreamingZipState) => StreamingZipState) => {
    const next = fn(stateRef.current)
    stateRef.current = next
    setState(next)
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
      abortRef.current?.abort()
      decisionRef.current?.resolve('cancel')
    }
    decisionRef.current = null
    setState(initialState)
    stateRef.current = initialState
  }, [])

  const cancel = useCallback(() => {
    cancelledRef.current = true
    abortRef.current?.abort()
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

      abortRef.current?.abort()
      decisionRef.current?.resolve('cancel')
      const abortController = new AbortController()
      abortRef.current = abortController
      cancelledRef.current = false
      decisionRef.current = null
      const runId = ++runIdRef.current
      const stale = () =>
        cancelledRef.current || abortController.signal.aborted || runIdRef.current !== runId
      const runUpdate = (fn: (prev: StreamingZipState) => StreamingZipState) => {
        if (!stale()) update(fn)
      }
      const getFetchInit: FetchInitProvider = () => {
        const init = typeof fetchInit === 'function' ? fetchInit() : fetchInit
        return {
          ...init,
          signal: init?.signal
            ? AbortSignal.any([abortController.signal, init.signal])
            : abortController.signal
        }
      }
      const totalBytes = files.reduce((s, f) => s + f.size, 0)
      runUpdate(() => ({
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
            if (stale()) throw new Error(CANCELLED_ERROR)
            const file = queue.shift() as FileTreeFile
            runUpdate((prev) => ({
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
              try {
                response = await fetchWithRetries({
                  url,
                  rangeHeader: firstPartRange,
                  fetchInit: getFetchInit,
                  retries: partRetries,
                  delayMs: partRetryDelayMs
                })
              } catch (rangeErr) {
                if (firstPartRange === undefined || !isRangeRefusal(rangeErr)) {
                  throw rangeErr
                }
                response = await fetchWithRetries({
                  url,
                  rangeHeader: undefined,
                  fetchInit: getFetchInit,
                  retries: partRetries,
                  delayMs: partRetryDelayMs
                })
              }
              if (!response.body) throw new Error('the server returned no file content')
            } catch (err) {
              if (stale()) throw new Error(CANCELLED_ERROR)
              const failure: StreamingZipFailure = {
                path: file.path,
                name: file.name,
                size: file.size,
                /* istanbul ignore next */
                error: err instanceof Error ? err.message : String(err),
                recoverable: strategy !== 'skip'
              }
              runUpdate((prev) => ({
                ...prev,
                failedSoFar: [...prev.failedSoFar, failure]
              }))
              if (strategy === 'pause') {
                runUpdate((prev) => ({ ...prev, status: 'paused' }))
                const decision = await waitForDecision()
                if (decision === 'cancel') throw new Error(CANCELLED_ERROR)
                if (decision === 'retry') {
                  runUpdate((prev) => ({
                    ...prev,
                    failedSoFar: prev.failedSoFar.slice(0, -1),
                    status: 'running'
                  }))
                  queue.unshift(file)
                  continue
                }
                if (decision === 'defer-to-end') {
                  strategy = 'twopass'
                  runUpdate((prev) => ({ ...prev, status: 'running' }))
                  continue
                }
                if (decision === 'skip' || decision === 'skip-all') {
                  if (decision === 'skip-all') {
                    strategy = 'skip'
                  }
                  runUpdate((prev) => {
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

            const stream = buildChunkedStream({
              file,
              initialResponse: response,
              originalUrl: url,
              partSize,
              partRetries,
              partRetryDelayMs,
              fetchInit: getFetchInit,
              onProgress: (delta) =>
                runUpdate((prev) => ({ ...prev, bytesDone: prev.bytesDone + delta })),
              onVerificationFailure: (failure) =>
                runUpdate((prev) => ({
                  ...prev,
                  verificationFailures: [...prev.verificationFailures, failure]
                })),
              onEntryFailure: async (error) => {
                const failure: StreamingZipFailure = {
                  path: file.path,
                  name: file.name,
                  size: file.size,
                  error,
                  recoverable: true,
                  midEntry: true
                }
                runUpdate((prev) => ({
                  ...prev,
                  status: 'paused',
                  failedSoFar: [...prev.failedSoFar, failure]
                }))
                const decision = await waitForDecision()
                if (decision === 'retry') {
                  runUpdate((prev) => ({
                    ...prev,
                    status: 'running',
                    failedSoFar: prev.failedSoFar.slice(0, -1)
                  }))
                  return 'retry'
                }
                return 'abort'
              },
              cancelled: stale
            })
            yield {
              name: file.path,
              input: stream,
              lastModified: new Date()
            }
            runUpdate((prev) => ({ ...prev, filesDone: prev.filesDone + 1 }))
          }
        }

        yield* processQueue()
        /* istanbul ignore next */
        if (stale()) throw new Error(CANCELLED_ERROR)

        if (strategy === 'twopass' && stateRef.current.failedSoFar.length > 0) {
          runUpdate((prev) => ({ ...prev, status: 'awaiting-retry' }))
          const decision = await waitForDecision()
          if (decision === 'cancel') throw new Error(CANCELLED_ERROR)
          if (decision === 'finalize') {
            for (const f of stateRef.current.failedSoFar.filter((x) => x.recoverable)) {
              skippedManifest.push({ ...f, recoverable: false })
            }
            runUpdate((prev) => ({
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
            runUpdate((prev) => ({
              ...prev,
              failedSoFar: prev.failedSoFar.filter((f) => !f.recoverable),
              pass: 2,
              status: 'running'
            }))
            yield* processQueue()
            const survivors = stateRef.current.failedSoFar.filter((f) => f.recoverable)
            if (survivors.length > 0) {
              for (const f of survivors) skippedManifest.push({ ...f, recoverable: false })
              runUpdate((prev) => ({
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
          const roots = new Set(files.map((file) => file.path.split('/')[0].toLowerCase()))
          let manifestName = 'manifest.txt'
          for (let index = 1; roots.has(manifestName); index++) {
            manifestName = `manifest-${index}.txt`
          }
          yield {
            name: manifestName,
            input: new Blob([lines.join('\n')], { type: 'text/plain' }),
            lastModified: new Date()
          }
        }
      }

      async function waitForDecision(): Promise<Decision> {
        if (stale()) return 'cancel'
        const bag = deferred<Decision>()
        decisionRef.current = bag
        return bag.promise
      }

      void (async () => {
        try {
          const sink =
            args.sink ?? (await resolveZipSink({ serviceWorkerUrl: args.serviceWorkerUrl }))
          if (stale()) return
          const withinCap = checkZipSelectionSize({
            bytes: files.reduce((sum, file) => sum + file.size, 0),
            streaming: sink.streaming,
            browserCanStream: sink.browserCanStream
          })
          if (!withinCap.allowed) {
            runUpdate((prev) => ({ ...prev, status: 'error', message: withinCap.message }))
            return
          }
          await sink.save({
            name: zipName,
            body: makeZip(iterableForZip()),
            shouldSave: () => !stale()
          })
          if (stale()) return
          runUpdate((prev) => ({ ...prev, status: 'done', current: undefined }))
        } catch (err) {
          if (stale()) return
          runUpdate((prev) => ({
            ...prev,
            status: 'error',
            message: err instanceof Error ? err.message : String(err)
          }))
        } finally {
          abortController.abort()
          if (runIdRef.current === runId) {
            decisionRef.current?.resolve('cancel')
            decisionRef.current = null
          }
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

function isRangeRefusal(err: unknown): boolean {
  return err instanceof HttpError && (err.status === 404 || err.status === 416)
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
    const attemptInit = args.fetchInit()
    attemptInit?.signal?.throwIfAborted()
    try {
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
      attemptInit?.signal?.throwIfAborted()
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

const UNREADABLE_STORAGE_ERROR =
  'storage did not return a readable response, even with a fresh link'

async function fetchPartWithRefresh(args: {
  cachedUrl: string
  originalUrl: string
  rangeHeader: string
  fetchInit: FetchInitProvider
  retries: number
  delayMs: number
  forceRefresh: boolean
}): Promise<{ response: Response; refreshedUrl: string | null }> {
  const refresh = async (): Promise<{ response: Response; refreshedUrl: string }> => {
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

  if (args.forceRefresh) {
    try {
      return await refresh()
    } catch (err) {
      throw err instanceof HttpError ? err : new Error(UNREADABLE_STORAGE_ERROR)
    }
  }

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
    return refresh()
  }
}

export function makeDigestAccumulator(
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
  const sha =
    upper === 'SHA-1' || upper === 'SHA1'
      ? sha1
      : upper === 'SHA-256' || upper === 'SHA256'
      ? sha256
      : upper === 'SHA-512' || upper === 'SHA512'
      ? sha512
      : null
  if (!sha) return null
  const hash = sha.create()
  return {
    update: (bytes) => {
      hash.update(bytes)
    },
    finalize: () => Promise.resolve(bytesToHex(hash.digest()))
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
  onEntryFailure: (error: string) => Promise<'retry' | 'abort'>
  cancelled: () => boolean
}): ReadableStream<Uint8Array> {
  const total = args.file.size
  const usedRange = args.initialResponse.status === 206
  let subsequentUrl =
    args.initialResponse.url && args.initialResponse.url !== args.originalUrl
      ? /* istanbul ignore next */ args.initialResponse.url
      : args.originalUrl
  const initialBody = args.initialResponse.body as ReadableStream<Uint8Array>
  let currentReader: ReadableStreamDefaultReader<Uint8Array> | null = initialBody.getReader()
  let delivered = 0
  let fetchedUpTo = usedRange ? Math.min(args.partSize, total) : total
  let staleUrl = false

  const expectedChecksum = args.file.checksum
  const digest = expectedChecksum ? makeDigestAccumulator(expectedChecksum.type) : null

  const dropReader = async () => {
    if (currentReader) {
      const reader = currentReader
      currentReader = null
      try {
        await reader.cancel()
      } catch {
        return
      }
    }
  }

  const resumeFromDelivered = async (): Promise<ReadableStreamDefaultReader<Uint8Array>> => {
    const end = Math.min(delivered + args.partSize, total) - 1
    const result = await fetchPartWithRefresh({
      cachedUrl: subsequentUrl,
      originalUrl: args.originalUrl,
      rangeHeader: `bytes=${delivered}-${end}`,
      fetchInit: args.fetchInit,
      retries: args.partRetries,
      delayMs: args.partRetryDelayMs,
      forceRefresh: staleUrl
    })
    staleUrl = false
    if (result.refreshedUrl) {
      subsequentUrl = result.refreshedUrl
    }
    /* istanbul ignore if */
    if (!result.response.body) {
      throw new Error('no body for range part')
    }
    if (result.response.status !== 206) {
      throw new Error('the server answered the resumed range with the whole file')
    }
    fetchedUpTo = end + 1
    return result.response.body.getReader()
  }

  const recover = async (err: unknown): Promise<boolean> => {
    await dropReader()
    const message = err instanceof Error ? err.message : String(err)
    if (!usedRange && delivered > 0) {
      return false
    }
    if (!(err instanceof HttpError)) {
      staleUrl = true
    }
    const decision = await args.onEntryFailure(message)
    return decision === 'retry'
  }

  return new ReadableStream<Uint8Array>({
    async pull(controller) {
      if (args.cancelled()) {
        controller.error(new Error(CANCELLED_ERROR))
        return
      }
      for (;;) {
        let reader = currentReader
        if (!reader) {
          if (delivered >= total) {
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
          try {
            reader = await resumeFromDelivered()
            currentReader = reader
          } catch (err) {
            if (await recover(err)) continue
            controller.error(err instanceof Error ? err : new Error(String(err)))
            return
          }
        }
        let chunk: ReadableStreamReadResult<Uint8Array>
        try {
          chunk = await reader.read()
        } catch (err) {
          if (await recover(err)) continue
          controller.error(err instanceof Error ? err : new Error(String(err)))
          return
        }
        const { value, done } = chunk
        if (done) {
          reader.releaseLock()
          currentReader = null
          if (delivered < fetchedUpTo) {
            const short = new Error(`connection closed at byte ${delivered} of ${fetchedUpTo}`)
            if (await recover(short)) continue
            controller.error(short)
            return
          }
          continue
        }
        if (value && value.byteLength > 0) {
          if (digest) digest.update(value)
          delivered += value.byteLength
          args.onProgress(value.byteLength)
          controller.enqueue(value)
          return
        }
      }
    },
    /* istanbul ignore next */
    async cancel() {
      await dropReader()
    }
  })
}
