import { useCallback, useRef, useState } from 'react'
import { downloadZip } from 'client-zip'
import { md5 } from 'js-md5'
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

/**
 * Per-file checksum-verification miss. The file's bytes ARE in the zip
 * (you can't unwrite a stream after client-zip has consumed it), but
 * its computed digest doesn't match what the tree response advertised.
 * Surfaced in the tray so users know which files to re-download and
 * appended to `manifest.txt` for the `skip` strategy.
 */
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
  /**
   * Files whose bytes flowed into the zip successfully but whose
   * computed digest didn't match the tree response's advertised
   * `checksum`. Empty when no verification was attempted (older server)
   * or all files verified clean.
   */
  verificationFailures: StreamingZipVerificationFailure[]
  pass: 1 | 2
  message?: string
}

export interface StartStreamingZipArgs {
  files: FileTreeFile[]
  zipName?: string
  strategy?: StreamingZipStrategy
  /** Allows a custom URL builder (e.g. JSF integration); defaults to `file.downloadUrl`. */
  buildFetchUrl?: (file: FileTreeFile) => string
  /**
   * Extra options forwarded to `fetch()`. Defaults to
   * `credentials: 'same-origin'` because the file-download URL typically
   * 302s to S3 (or an S3-compatible store) which returns
   * `Access-Control-Allow-Origin: *`, and browsers refuse `*` + credentials.
   * `same-origin` carries the Dataverse session cookie on the Dataverse
   * hop and drops it on the cross-origin S3 hop, which is what we want.
   */
  fetchInit?: RequestInit
  /**
   * Files larger than this are fetched as a sequence of HTTP `Range`
   * requests instead of one full GET. Each part is retried on its own
   * (`partRetries`), so a transient TCP drop mid-file no longer aborts
   * the whole download. Default `10 * 1024 * 1024` (10 MiB).
   */
  partSize?: number
  /** Per-part retry budget for chunked fetches. Default `3`. */
  partRetries?: number
  /** Backoff between part retries, in ms. Default `500`. */
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
 * Per-file progress is tracked inside the custom `ReadableStream` that
 * `buildChunkedStream` returns: it tallies bytes as `client-zip` pulls
 * them, and lazily fetches additional Range parts when the file is
 * larger than `partSize`.
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
        fetchInit,
        partSize = DEFAULT_PART_SIZE_BYTES,
        partRetries = DEFAULT_PART_RETRIES,
        partRetryDelayMs = DEFAULT_PART_RETRY_DELAY_MS
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

            const url = buildFetchUrl(file)
            // Files larger than `partSize` are fetched as a sequence of
            // Range requests so a transient drop mid-file only invalidates
            // the active part instead of the whole file. The first part
            // still goes through the existing retry/skip/defer dialog on
            // hard failure (the body hasn't started streaming into the
            // zip yet); subsequent parts can only retry inline because
            // client-zip is already consuming the stream.
            const useRange = file.size > partSize
            const firstPartRange = useRange
              ? `bytes=0-${Math.min(partSize, file.size) - 1}`
              : undefined

            let response: Response
            try {
              response = await fetchWithRetries({
                url,
                rangeHeader: firstPartRange,
                fetchInit,
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
                if (decision === 'skip' || decision === 'skip-all') {
                  // Both skip variants demote the just-added failure to
                  // non-recoverable. Without this, a later 'defer-to-end'
                  // decision on a different file would re-queue the
                  // already-skipped file in its second pass (see the
                  // recoverable filter in the awaiting-retry path).
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
            const stream = buildChunkedStream({
              file,
              initialResponse: response,
              originalUrl: url,
              partSize,
              partRetries,
              partRetryDelayMs,
              fetchInit,
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

        // ----- manifest.txt: list any skipped or verification-failed files ----
        // Both populate the manifest; the zip is closing and this is the
        // last yield, so we collect from `stateRef` (which has any
        // mid-stream verification failures the per-file pull pushed
        // through the update callback) plus `skippedManifest` (the
        // fetch-level failures from the per-file loop).
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

/**
 * Thrown by `fetchWithRetries` when the server returns a non-OK status.
 * Carries the status code so callers can distinguish transient failures
 * (worth retrying) from terminal ones (worth surfacing immediately).
 */
class HttpError extends Error {
  constructor(public readonly status: number, statusText: string) {
    super(`HTTP ${status} ${statusText}`)
    this.name = 'HttpError'
  }
}

/**
 * `true` for HTTP statuses that have any reasonable chance of succeeding
 * on a re-attempt: 5xx server errors, plus the few 4xx codes that the
 * spec defines as transient (408 Request Timeout, 425 Too Early, 429
 * Too Many Requests). Other 4xx codes (401, 403, 404, …) are user-
 * facing terminal errors — retrying just wastes the budget while the
 * user waits to see the failure tray.
 */
function isTransientHttpStatus(status: number): boolean {
  if (status >= 500) return true
  return status === 408 || status === 425 || status === 429
}

/**
 * One fetch with up to `retries` extra attempts. A `Range` header is
 * forwarded when supplied; a non-OK status is converted to an
 * {@link HttpError} so the caller can react. Retry budget is skipped on
 * terminal 4xx (no amount of retrying turns a 403 into a 200) — those
 * errors propagate on the first attempt. Network errors and transient
 * statuses retry normally. When all retries are exhausted the last
 * error is re-thrown for the caller to surface in its own failure UI.
 */
async function fetchWithRetries(args: {
  url: string
  rangeHeader: string | undefined
  fetchInit: RequestInit | undefined
  retries: number
  delayMs: number
}): Promise<Response> {
  let lastErr: unknown = new Error('no attempt made')
  for (let attempt = 0; attempt <= args.retries; attempt++) {
    try {
      const headers = new Headers(args.fetchInit?.headers ?? undefined)
      if (args.rangeHeader !== undefined) headers.set('Range', args.rangeHeader)
      const response = await fetch(args.url, {
        // `same-origin` keeps cookies on the initial Dataverse call
        // (same-origin in both SPA and JSF embed) but drops them when
        // the browser follows a redirect to S3-style storage. With
        // `download-redirect=true` the 302 target is on the bucket's
        // hostname; sending credentials there would require
        // `Access-Control-Allow-Credentials: true`, incompatible with
        // the typical `Allow-Origin: *` rule.
        credentials: 'same-origin',
        ...(args.fetchInit ?? {}),
        headers
      })
      if (!response.ok) {
        throw new HttpError(response.status, response.statusText)
      }
      return response
    } catch (err) {
      lastErr = err
      // Terminal 4xx: bail before burning the rest of the budget.
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

/**
 * Append a query parameter to a URL string without dragging in a URL
 * parser. Inputs are well-formed URLs from the SDK / our own builders,
 * so the simple "find a `?` or add one" rule is sufficient — no need
 * to handle weird relative-with-fragment cases.
 */
function appendQueryParam(url: string, key: string, value: string): string {
  const sep = url.includes('?') ? '&' : '?'
  return `${url}${sep}${encodeURIComponent(key)}=${encodeURIComponent(value)}`
}

/**
 * Range fetch with re-presign-on-403 fallback. When the cached
 * `subsequentUrl` returns 403 (presigned URL has expired since the
 * file's first chunk was retrieved), this helper transparently
 * re-fetches the Dataverse access endpoint with `gbrecs=true` (so the
 * download isn't double-counted in the guestbook), captures the new
 * S3 redirect target, and returns the bytes for the requested range.
 * Callers update their cached URL from the returned `refreshedUrl` so
 * subsequent parts use the fresh presigning until *that* one expires.
 *
 * Anything other than 403 (network errors, 5xx, retried-out transient
 * failures) propagates from the inner `fetchWithRetries` and aborts
 * the chunked stream — re-presign helps for "URL expired", not for
 * "access genuinely denied" or "S3 melted".
 */
async function fetchPartWithRefresh(args: {
  cachedUrl: string
  originalUrl: string
  rangeHeader: string
  fetchInit: RequestInit | undefined
  retries: number
  delayMs: number
}): Promise<{ response: Response; refreshedUrl: string | null }> {
  try {
    const response = await fetchWithRetries({
      url: args.cachedUrl,
      rangeHeader: args.rangeHeader,
      fetchInit: args.fetchInit,
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
    // Prefer the post-redirect URL when fetch followed the 303 to S3
    // (`response.url` differs from the request URL); fall back to the
    // refresh URL itself when no redirect happened (test env, or a
    // non-redirected storage driver). Either keeps subsequent parts
    // off the guestbook path.
    const newUrl =
      refreshed.url && refreshed.url !== refreshUrl
        ? /* istanbul ignore next */ refreshed.url
        : refreshUrl
    return { response: refreshed, refreshedUrl: newUrl }
  }
}

/**
 * Streaming digest accumulator. Two branches matching what
 * `FileUploaderHelper` already does for upload:
 *   - MD5 (Dataverse default): `js-md5`'s `create()/update()/hex()` —
 *     true streaming, no buffer of the file's bytes.
 *   - SHA-1 / SHA-256 / SHA-512: `crypto.subtle.digest` is one-shot,
 *     so we accumulate chunks (1 MiB max per slice) and digest the
 *     concatenation when the file closes. Memory cost is the file
 *     size for SHA — fine for typical research-data sizes, the same
 *     trade-off the upload helper accepts. A streaming-SHA WASM
 *     library would close the gap if it ever bites; not in scope.
 *
 * `null` for unsupported / unknown algorithm names — caller treats it
 * as "skip verification for this file" rather than erroring out, so a
 * file whose `checksum.type` is something exotic doesn't kill the zip.
 */
function makeDigestAccumulator(
  algorithm: string
): { update: (bytes: Uint8Array) => void; finalize: () => Promise<string> } | null {
  const upper = algorithm.toUpperCase()
  if (upper === 'MD5') {
    const hash = md5.create()
    return {
      update: (bytes) => hash.update(bytes),
      // Wrapped in Promise.resolve to unify the return type with the
      // SHA path's `subtle.digest` Promise — caller awaits in both
      // cases, MD5 just resolves synchronously.
      finalize: () => Promise.resolve(hash.hex())
    }
  }
  // Map Dataverse's stored algorithm name to the Web Crypto identifier.
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
      // Copy the slice — the source buffer may be reused by the
      // fetch reader between ticks.
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

/**
 * Wraps the first-part response and lazily fetches the remaining parts
 * via Range requests as `client-zip` pulls bytes through the stream.
 *
 * If the server returned `200` to the first request (Range was either
 * not set or not honored), the response is treated as the full file —
 * no further parts are requested. Otherwise the response's `.url`
 * (after the 303 to S3) is used for the subsequent part requests so
 * those bypass Dataverse entirely; that's the path that gives us the
 * resilience win on flaky cross-region links.
 *
 * When the file's tree row carries a `checksum`, the bytes are also
 * fed into a streaming digest accumulator and compared at end-of-stream
 * — a mismatch is reported via `onVerificationFailure` but does NOT
 * fail the file (its bytes are already in the zip; the user is told
 * which files need re-downloading).
 */
function buildChunkedStream(args: {
  file: FileTreeFile
  initialResponse: Response
  originalUrl: string
  partSize: number
  partRetries: number
  partRetryDelayMs: number
  fetchInit: RequestInit | undefined
  onProgress: (delta: number) => void
  onVerificationFailure: (failure: StreamingZipVerificationFailure) => void
  cancelled: () => boolean
}): ReadableStream<Uint8Array> {
  const total = args.file.size
  const usedRange = args.initialResponse.status === 206
  const numParts = usedRange ? Math.ceil(total / args.partSize) : 1
  // `subsequentUrl` is the URL chunks 1..N-1 hit. Mutable because a 403
  // mid-download (presigned URL expired) triggers a re-presign that
  // returns a fresh URL we cache here for the rest of the file. Same
  // pattern repeats every time the new URL itself expires.
  let subsequentUrl =
    args.initialResponse.url && args.initialResponse.url !== args.originalUrl
      ? /* istanbul ignore next */ args.initialResponse.url
      : args.originalUrl

  // Caller has already null-checked `initialResponse.body` (see the
  // /* istanbul ignore next */ guard in the engine), so the assertion
  // here only narrows the type — the runtime check is upstream.
  const initialBody = args.initialResponse.body as ReadableStream<Uint8Array>
  let partIndex = 0
  let currentReader: ReadableStreamDefaultReader<Uint8Array> | null = initialBody.getReader()

  // Digest accumulator: present only when the tree response gave us a
  // checksum AND the algorithm is one we can compute. Files where the
  // tree omitted `checksum` (e.g. ingested-tabular default form) get
  // no accumulator — skipped silently. Files with an exotic algorithm
  // also fall through to skip rather than error.
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
      // Drain the current part; on exhaustion, advance to the next part
      // (or close the stream if all parts are done).
      for (;;) {
        if (!currentReader) {
          if (partIndex >= numParts) {
            // Stream is closing — if we have a digest, finalize and
            // compare against the expected value. Mismatch is reported
            // via the callback (the bytes are already in the zip; the
            // user is told which files to re-download).
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
          // Reader may already be closed; cancellation is best-effort.
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
  // Defer revoke so the browser actually starts the download.
  setTimeout(() => URL.revokeObjectURL(url), 4_000)
}
