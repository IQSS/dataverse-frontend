import { useCallback, useRef, useState } from 'react'
import { downloadZip } from 'client-zip'
import { FileTreeFile } from '@/files/domain/models/FileTreeItem'

/**
 * Strategy for handling per-file fetch failures during a streaming-zip
 * download.
 *
 * - `pause`: stop the engine on the first failure and surface a
 *   retry / skip / skip-all decision to the caller. Default — matches
 *   the behaviour the design bundle prescribes.
 * - `skip`: best-effort. Failed files are dropped, listed in a
 *   `manifest.txt` entry inside the resulting zip, and the engine
 *   keeps going.
 * - `twopass`: failed files are deferred. After the first pass the
 *   engine waits for the caller to call `retryFailed()`; at that
 *   point it re-queues all recoverable failures as a second pass.
 */
export type StreamingZipStrategy = 'pause' | 'skip' | 'twopass'

export interface StreamingZipFailure {
  path: string
  name: string
  size: number
  error: string
  recoverable: boolean
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
  pass: 1 | 2
  message?: string
}

export interface StartStreamingZipArgs {
  files: FileTreeFile[]
  zipName?: string
  strategy?: StreamingZipStrategy
  /** Allows a custom URL builder (e.g. JSF integration); defaults to `file.downloadUrl`. */
  buildFetchUrl?: (file: FileTreeFile) => string
  /** Extra options forwarded to `fetch()` (defaults to `credentials: 'include'`). */
  fetchInit?: RequestInit
}

export interface StreamingZipApi {
  state: StreamingZipState
  start: (args: StartStreamingZipArgs) => void
  retryCurrent: () => void
  skipCurrent: () => void
  skipAllFailures: () => void
  /**
   * Convert the current pause-on-fail dialog into a two-pass run:
   * the failure stays in `failedSoFar` as recoverable, the strategy
   * switches to `twopass`, and the engine keeps going without pausing
   * on subsequent failures. After the first pass finishes the engine
   * pauses with `status: 'awaiting-retry'` so the host can call
   * `retryFailed`.
   */
  deferCurrentToEnd: () => void
  retryFailed: () => void
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

/**
 * Streaming-zip download driver.
 *
 * Builds a zip in the browser by piping per-file response bodies
 * through `client-zip`. The result is a single `Response` whose body is
 * a `ReadableStream`; we materialise it to a `Blob` and trigger a
 * save via an anchor click. For very large datasets this still buffers
 * the zip in memory; future work can swap the blob save for the
 * File System Access API or a Service Worker stream-saver.
 *
 * Per-file progress is tracked through a `TransformStream` that counts
 * bytes as `client-zip` pulls them from the response body.
 */
export function useStreamingZipDownload(): StreamingZipApi {
  const [state, setState] = useState<StreamingZipState>(initialState)
  const stateRef = useRef<StreamingZipState>(initialState)
  stateRef.current = state

  // Engine control: a single "decision" promise that the iterator
  // awaits when paused. The UI calls retryCurrent/skipCurrent/etc.
  // which resolve this promise with the requested action.
  type Decision = 'retry' | 'skip' | 'skip-all' | 'defer-to-end' | 'retry-failed' | 'cancel'
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
    cancelledRef.current = false
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

  const start = useCallback(
    (args: StartStreamingZipArgs) => {
      const {
        files,
        zipName = 'dataset.zip',
        strategy: initialStrategy = 'pause',
        buildFetchUrl = (f) => f.downloadUrl,
        fetchInit
      } = args
      /* istanbul ignore if */
      if (files.length === 0) return

      cancelledRef.current = false
      decisionRef.current = null
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
        // ----- helper: process a queue ----------------------------------
        const processQueue = async function* () {
          while (queue.length > 0) {
            // Loop-top cancel guard. The pause-decision path also
            // resolves with 'cancel' and aborts, which the spec covers;
            // this is the additional check for cancellation that lands
            // *between* files in a fast-scrolling run.
            /* istanbul ignore next */
            if (cancelledRef.current) return
            const file = queue.shift() as FileTreeFile
            update((prev) => ({
              ...prev,
              status: 'running',
              current: { name: file.name, path: file.path, size: file.size }
            }))

            let response: Response
            try {
              response = await fetch(buildFetchUrl(file), {
                credentials: 'include',
                ...(fetchInit ?? {})
              })
              if (!response.ok) {
                throw new Error(`HTTP ${response.status} ${response.statusText}`)
              }
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
                  // pop the failure record we just added and re-queue this file
                  update((prev) => ({
                    ...prev,
                    failedSoFar: prev.failedSoFar.slice(0, -1),
                    status: 'running'
                  }))
                  queue.unshift(file)
                  continue
                }
                if (decision === 'defer-to-end') {
                  // Switch to twopass: the failure stays recoverable in
                  // failedSoFar, the engine stops pausing, and a second
                  // pass will pick up all recoverable failures at the end.
                  strategy = 'twopass'
                  update((prev) => ({ ...prev, status: 'running' }))
                  continue
                }
                if (decision === 'skip-all') {
                  strategy = 'skip'
                  // mark the just-added failure as non-recoverable too
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
                // 'skip' or 'skip-all' fall through
                skippedManifest.push({ ...failure, recoverable: false })
                continue
              }
              if (strategy === 'skip') {
                skippedManifest.push({ ...failure, recoverable: false })
                continue
              }
              // 'twopass': defer; second pass will pick recoverable ones up
              continue
            }

            // Wrap the body in a counting stream so we can track bytes.
            // `response.body` is null only for `Response.error()` and a
            // handful of legacy fetch implementations; modern browsers
            // always populate it on a successful HTTP response. Kept as
            // a safety net; not exercised by the test harness.
            /* istanbul ignore next */
            if (!response.body) {
              update((prev) => ({
                ...prev,
                filesDone: prev.filesDone + 1,
                bytesDone: prev.bytesDone + file.size
              }))
              continue
            }
            const counted = countingStream(response.body, (delta) => {
              update((prev) => ({ ...prev, bytesDone: prev.bytesDone + delta }))
            })
            yield {
              name: file.path,
              input: counted,
              lastModified: new Date()
            }
            update((prev) => ({ ...prev, filesDone: prev.filesDone + 1 }))
          }
        }

        // ----- first pass --------------------------------------------------
        yield* processQueue()
        // Cancel-after-first-pass guard. processQueue's own cancel
        // checks short-circuit before reaching here in the cancel path.
        /* istanbul ignore next */
        if (cancelledRef.current) return

        // ----- two-pass: pause for user decision then re-queue failures ----
        if (strategy === 'twopass' && stateRef.current.failedSoFar.length > 0) {
          update((prev) => ({ ...prev, status: 'awaiting-retry' }))
          const decision = await waitForDecision()
          /* istanbul ignore if */
          if (decision === 'cancel') return
          if (decision === 'retry-failed') {
            const recoverable = stateRef.current.failedSoFar.filter((f) => f.recoverable)
            // Reconstruct the file objects from the tail of `files`:
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
          }
        }

        // ----- skip strategy: append a manifest.txt with failures ----------
        if (skippedManifest.length > 0) {
          const lines = [
            'The following files were skipped during this zip download:',
            '',
            ...skippedManifest.map((f) => `${f.path} — ${f.error}`)
          ]
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
          // Defensive catch for unexpected failures inside `client-zip`
          // or the anchor-click. The per-file fetch failures are
          // handled inline above; reaching here means something
          // happened that the per-file flow can't classify.
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
    deferCurrentToEnd,
    retryFailed,
    cancel,
    close
  }
}

function countingStream(
  source: ReadableStream<Uint8Array>,
  onProgress: (delta: number) => void
): ReadableStream<Uint8Array> {
  const transform = new TransformStream<Uint8Array, Uint8Array>({
    transform(chunk, controller) {
      onProgress(chunk.byteLength)
      controller.enqueue(chunk)
    }
  })
  return source.pipeThrough(transform)
}

function triggerDownload(blob: Blob, name: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Defer revoke so the browser actually starts the download.
  setTimeout(() => URL.revokeObjectURL(url), 4_000)
}
