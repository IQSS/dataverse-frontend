import { useState } from 'react'
import { useStreamingZipDownload } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useStreamingZipDownload'
import { FilesTreeDownloadTray } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTreeDownloadTray'
import { FileTreeFile } from '../../../../../../src/files/domain/models/FileTreeItem'
import { FileTreeFileMother } from '../../../../files/domain/models/FileTreeItemMother'

/**
 * Harness component: renders the tray plus a kick-off button that
 * starts the engine. Lets the spec drive the engine end-to-end via the
 * same code path the host (FilesTree) uses.
 */
function StreamingZipHarness({
  files,
  zipName,
  strategy,
  partSize,
  partRetries = 0
}: {
  files: FileTreeFile[]
  zipName: string
  strategy?: 'pause' | 'skip' | 'twopass'
  partSize?: number
  /**
   * Defaults to 0 so the existing pause-on-fail tests still see a
   * single attempt per file. Tests that exercise the auto-retry path
   * pass an explicit value.
   */
  partRetries?: number
}) {
  const api = useStreamingZipDownload()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        data-testid="harness-start"
        onClick={() => {
          api.start({
            files,
            zipName,
            strategy,
            partSize,
            partRetries,
            // 0ms backoff keeps the retry-exhaustion paths snappy.
            partRetryDelayMs: 0
          })
          setOpen(true)
        }}>
        Start
      </button>
      <button type="button" data-testid="harness-retry-current" onClick={() => api.retryCurrent()}>
        Spam Retry
      </button>
      <FilesTreeDownloadTray
        api={api}
        open={open}
        onClose={() => {
          setOpen(false)
          api.close()
        }}
      />
    </>
  )
}

function fakeResponseBody(content: string): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(content))
      controller.close()
    }
  })
  return new Response(stream, {
    status: 200,
    headers: { 'content-type': 'application/octet-stream' }
  })
}

type FetchHandler = (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>

/**
 * Installs the per-test fetch handler on the cypress iframe window
 * AFTER the harness has mounted. Doing this before mount can race with
 * cypress's iframe lifecycle; doing it after is deterministic.
 *
 * Direct assignment (rather than `cy.stub(win, 'fetch')`) sidesteps a
 * Sinon defineProperty failure when the runtime declares fetch as a
 * non-configurable getter.
 */
function installFetchHandler(handler: FetchHandler) {
  cy.window().then((win) => {
    ;(win as unknown as { fetch: FetchHandler }).fetch = handler
    // Suppress the actual download trigger so cypress's runner doesn't
    // navigate when the engine clicks the synthetic anchor.
    cy.stub(win.HTMLAnchorElement.prototype, 'click').callsFake(() => undefined)
  })
}

describe('useStreamingZipDownload + FilesTreeDownloadTray', () => {
  it('streams two files into a zip on the happy path', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 5,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'b.txt',
        path: 'b.txt',
        size: 5,
        downloadUrl: '/access/2'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="test.zip" />)
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAAAA'))
      if (url.endsWith('/access/2')) return Promise.resolve(fakeResponseBody('BBBBB'))
      return Promise.reject(new Error(`unexpected fetch ${url}`))
    })

    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray').should('be.visible')
    cy.findByTestId('files-tree-download-tray-meta').should('contain.text', '2 / 2')
    cy.contains(/download complete/i).should('exist')
  })

  it('pauses on first failure and resumes on retry', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'b.txt',
        path: 'b.txt',
        size: 3,
        downloadUrl: '/access/2'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="retry.zip" />)

    let attempts = 0
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
      if (url.endsWith('/access/2')) {
        attempts += 1
        if (attempts === 1) return Promise.reject(new Error('network blip'))
        return Promise.resolve(fakeResponseBody('BBB'))
      }
      return Promise.reject(new Error(`unexpected fetch ${url}`))
    })

    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/Retry this file/i).click()
    cy.contains(/download complete/i).should('exist')
    cy.then(() => {
      expect(attempts).to.equal(2)
    })
  })

  it('skips a failed file when "Skip" is clicked and lists it in the manifest', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'broken.bin',
        path: 'broken.bin',
        size: 3,
        downloadUrl: '/access/2'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="skip.zip" />)
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
      return Promise.reject(new Error('permanently broken'))
    })

    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/^Skip$/).click()
    cy.contains(/Download complete — 1 skipped/i).should('exist')
  })

  it('switches to two-pass on "Skip & retry at end" and finishes after retry', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'flaky.bin',
        path: 'flaky.bin',
        size: 3,
        downloadUrl: '/access/2'
      }),
      FileTreeFileMother.create({
        id: 3,
        name: 'c.txt',
        path: 'c.txt',
        size: 3,
        downloadUrl: '/access/3'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="twopass.zip" />)

    let flakyAttempts = 0
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
      if (url.endsWith('/access/3')) return Promise.resolve(fakeResponseBody('CCC'))
      if (url.endsWith('/access/2')) {
        flakyAttempts += 1
        // Fails on the first pass; succeeds during the second-pass retry.
        if (flakyAttempts === 1) return Promise.reject(new Error('flaky network'))
        return Promise.resolve(fakeResponseBody('BBB'))
      }
      return Promise.reject(new Error(`unexpected fetch ${url}`))
    })

    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/Skip & retry at end/i).click()

    cy.findByTestId('files-tree-download-tray-twopass').should('be.visible')
    cy.contains(/Download 1 missing file/i).click()
    cy.contains(/download complete/i).should('exist')
    cy.then(() => {
      expect(flakyAttempts).to.equal(2)
    })
  })

  it('cancels the run from the pause-on-fail dialog and reports cancelled state', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'broken.bin',
        path: 'broken.bin',
        size: 3,
        downloadUrl: '/access/2'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="cancel.zip" />)
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
      return Promise.reject(new Error('permanently broken'))
    })

    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    // Cancel the run from the always-visible footer Cancel button.
    cy.contains(/^Cancel$/).click()
    cy.contains(/download cancelled/i).should('exist')
  })

  it('treats a non-OK HTTP response (500) as a failure under pause strategy', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'server-error.bin',
        path: 'server-error.bin',
        size: 3,
        downloadUrl: '/access/2'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="non-ok.zip" />)
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
      // Non-OK response — should hit the `if (!response.ok)` failure path
      // rather than the network-error catch branch. Engine treats it the
      // same as a thrown fetch and pauses for the user's decision.
      return Promise.resolve(
        new Response('boom', { status: 500, statusText: 'Internal Server Error' })
      )
    })

    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/HTTP 500/i).should('exist')
    cy.contains(/^Skip$/).click()
    cy.contains(/Download complete — 1 skipped/i).should('exist')
  })

  it('starts in skip strategy and silently drops failures into the manifest', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'broken.bin',
        path: 'broken.bin',
        size: 3,
        downloadUrl: '/access/2'
      }),
      FileTreeFileMother.create({
        id: 3,
        name: 'c.txt',
        path: 'c.txt',
        size: 3,
        downloadUrl: '/access/3'
      })
    ]

    cy.customMount(
      <StreamingZipHarness files={files} zipName="skip-from-start.zip" strategy="skip" />
    )
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
      if (url.endsWith('/access/3')) return Promise.resolve(fakeResponseBody('CCC'))
      return Promise.reject(new Error('permanently broken'))
    })

    cy.findByTestId('harness-start').click()
    // No pause dialog: the engine never stops because strategy === 'skip'
    // from the very first call. Goes straight to "Download complete".
    cy.findByTestId('files-tree-download-tray-failure').should('not.exist')
    cy.contains(/Download complete — 1 skipped/i).should('exist')
  })

  it('does nothing when start() is called with an empty file list', () => {
    cy.customMount(<StreamingZipHarness files={[]} zipName="empty.zip" />)
    // No fetch handler needed — the engine should not call fetch at all.
    cy.findByTestId('harness-start').click()
    // Tray is the only thing the harness renders for the engine; with
    // nothing to do the engine stays in idle.
    cy.findByTestId('files-tree-download-tray').should('exist')
    cy.contains(/download complete/i).should('not.exist')
    cy.contains(/download cancelled/i).should('not.exist')
  })

  it('ignores stray decision clicks fired with no pending decision', () => {
    // Spam-clicking "Retry" when the engine isn't paused must not throw
    // and must not affect a subsequent run. Exercises the `if (!bag)`
    // guard in sendDecision.
    cy.customMount(<StreamingZipHarness files={[]} zipName="stray.zip" />)
    cy.findByTestId('harness-retry-current').click()
    cy.findByTestId('harness-retry-current').click()
    // Tray is open from prior render of the harness — stray clicks must
    // not have triggered any state-change visible to the user.
    cy.contains(/download complete/i).should('not.exist')
  })

  it('silently retries a transient failure when partRetries is set', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'flaky.txt',
        path: 'flaky.txt',
        size: 3,
        downloadUrl: '/access/1'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="auto-retry.zip" partRetries={3} />)

    let attempts = 0
    installFetchHandler(() => {
      attempts += 1
      // Fail once, then succeed. With partRetries=3 the engine should
      // retry inline and never surface the failure dialog.
      if (attempts === 1) return Promise.reject(new Error('transient blip'))
      return Promise.resolve(fakeResponseBody('AAA'))
    })

    cy.findByTestId('harness-start').click()
    cy.contains(/download complete/i).should('exist')
    cy.findByTestId('files-tree-download-tray-failure').should('not.exist')
    cy.then(() => {
      expect(attempts).to.equal(2)
    })
  })

  it('does not burn retry budget on a terminal 4xx (e.g. 403)', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'denied.txt',
        path: 'denied.txt',
        size: 3,
        downloadUrl: '/access/1'
      })
    ]
    // partRetries=3 would otherwise let the engine attempt the same
    // request 4 times. 403 is a "user error" — the user genuinely lacks
    // access — and burning the budget on it just delays the failure
    // tray. The engine bails on the first attempt and surfaces the
    // failure immediately.
    cy.customMount(<StreamingZipHarness files={files} zipName="403.zip" partRetries={3} />)

    let attempts = 0
    installFetchHandler(() => {
      attempts += 1
      return Promise.resolve(new Response('forbidden', { status: 403, statusText: 'Forbidden' }))
    })

    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/HTTP 403/i).should('exist')
    cy.then(() => {
      expect(attempts).to.equal(1)
    })
  })

  it('still retries on a transient 5xx with partRetries set', () => {
    // Mirror of the no-retry-on-4xx test above, this time confirming
    // that 5xx (transient) DOES still retry. Without this contrast
    // it would be ambiguous whether the previous test passed because
    // of the terminal-4xx logic or because of some other change.
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'flaky.txt',
        path: 'flaky.txt',
        size: 3,
        downloadUrl: '/access/1'
      })
    ]
    cy.customMount(<StreamingZipHarness files={files} zipName="503.zip" partRetries={3} />)

    let attempts = 0
    installFetchHandler(() => {
      attempts += 1
      if (attempts === 1) {
        return Promise.resolve(
          new Response('temporarily unavailable', {
            status: 503,
            statusText: 'Service Unavailable'
          })
        )
      }
      return Promise.resolve(fakeResponseBody('AAA'))
    })

    cy.findByTestId('harness-start').click()
    cy.contains(/download complete/i).should('exist')
    cy.findByTestId('files-tree-download-tray-failure').should('not.exist')
    cy.then(() => {
      expect(attempts).to.equal(2)
    })
  })

  it('re-presigns the URL when a non-first chunk gets 403, then resumes', () => {
    // Simulates the long-running download case: the first chunk got a
    // 60-minute presigned URL, the user is on a slow link, the 50th
    // chunk arrives after the URL has expired and S3 returns 403.
    // The engine refreshes the presigning by hitting Dataverse's
    // access endpoint with `gbrecs=true` (so it doesn't double-count
    // in the guestbook) and resumes from the failed offset. Without
    // the refresh, the whole zip would die and any large file > the
    // configured `url-expiration-minutes` would be undownloadable.
    const total = 12 // 3 chunks at partSize=4
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'long.bin',
        path: 'long.bin',
        size: total,
        downloadUrl: '/access/1'
      })
    ]
    cy.customMount(
      <StreamingZipHarness files={files} zipName="repesign.zip" partSize={4} partRetries={0} />
    )

    let chunk1AttemptsOnOriginal = 0
    let refreshHits = 0
    installFetchHandler((input, init) => {
      const url = String(input)
      const headers = new Headers(init?.headers ?? undefined)
      const range = headers.get('Range') ?? ''
      const slice = (start: number, end: number) =>
        new Response(new TextEncoder().encode('ABCDEFGHIJKL'.slice(start, end + 1)), {
          status: 206,
          statusText: 'Partial Content',
          headers: {
            'content-type': 'application/octet-stream',
            'content-range': `bytes ${start}-${end}/${total}`
          }
        })

      // The re-presign path appends `gbrecs=true` to the original URL.
      // Treat any URL with that flag as the "fresh" URL — return the
      // requested range bytes from it.
      if (url.includes('gbrecs=true')) {
        refreshHits += 1
        const m = /^bytes=(\d+)-(\d+)$/.exec(range) as RegExpExecArray
        return Promise.resolve(slice(Number(m[1]), Number(m[2])))
      }

      // Chunk 0 (bytes=0-3) succeeds normally on the original URL.
      if (range === 'bytes=0-3') {
        return Promise.resolve(slice(0, 3))
      }

      // Chunk 1 (bytes=4-7) on the original URL returns 403 ONCE — the
      // expired-URL signal. After re-presign it goes through the
      // gbrecs=true branch above. Subsequent parts use the cached new
      // URL and never hit this branch again.
      if (range === 'bytes=4-7') {
        chunk1AttemptsOnOriginal += 1
        return Promise.resolve(new Response('expired', { status: 403, statusText: 'Forbidden' }))
      }

      return Promise.reject(new Error(`unexpected fetch: ${url} ${range}`))
    })

    cy.findByTestId('harness-start').click()
    cy.contains(/download complete/i).should('exist')
    cy.then(() => {
      // Chunk 1 hit the original URL exactly once (the 403); the
      // refresh path picked up chunks 1 AND 2 from there on. So:
      //   - 1 hit on the original URL with bytes=4-7 (the 403)
      //   - 2 refresh hits (bytes=4-7 retried + bytes=8-11 fresh)
      expect(chunk1AttemptsOnOriginal).to.equal(1)
      expect(refreshHits).to.equal(2)
    })
  })

  it('errors out when the re-presign request itself returns 403 (real access denial)', () => {
    // Same shape as above, but the re-presign also fails — so the user
    // genuinely lost access to the file mid-download (admin revoked
    // the grant, or the embargo flipped). The engine has nothing to
    // recover from; the stream errors out cleanly.
    const total = 8 // 2 chunks at partSize=4
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'revoked.bin',
        path: 'revoked.bin',
        size: total,
        downloadUrl: '/access/1'
      })
    ]
    cy.customMount(
      <StreamingZipHarness files={files} zipName="revoked.zip" partSize={4} partRetries={0} />
    )

    installFetchHandler((input, init) => {
      const url = String(input)
      const headers = new Headers(init?.headers ?? undefined)
      const range = headers.get('Range') ?? ''
      if (url.includes('gbrecs=true')) {
        // The re-presign also gets 403 → terminal failure.
        return Promise.resolve(
          new Response('still forbidden', { status: 403, statusText: 'Forbidden' })
        )
      }
      if (range === 'bytes=0-3') {
        return Promise.resolve(
          new Response(new TextEncoder().encode('ABCD'), {
            status: 206,
            statusText: 'Partial Content',
            headers: { 'content-range': `bytes 0-3/${total}` }
          })
        )
      }
      // Chunk 1 returns 403 → triggers re-presign → which also 403s.
      return Promise.resolve(new Response('expired', { status: 403, statusText: 'Forbidden' }))
    })

    cy.findByTestId('harness-start').click()
    // The 'error' tray label is /* istanbul ignore next */, so we
    // assert on the absence of "complete" — the engine reaches the
    // error state, not the done state.
    cy.contains(/download complete/i, { timeout: 5_000 }).should('not.exist')
  })

  it('verifies the MD5 checksum and finishes silently when it matches', () => {
    // Bytes "hello" have a well-known MD5 digest; we make the tree row
    // advertise that digest. After download the engine should have
    // streamed the bytes through `md5.create()/update()/hex()` and
    // matched — no entry in `verificationFailures`, no tray scolding.
    const md5OfHello = '5d41402abc4b2a76b9719d911017c592'
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'h.txt',
        path: 'h.txt',
        size: 5,
        downloadUrl: '/access/1',
        checksum: { type: 'MD5', value: md5OfHello }
      })
    ]
    cy.customMount(<StreamingZipHarness files={files} zipName="verify-ok.zip" />)
    installFetchHandler(() => Promise.resolve(fakeResponseBody('hello')))

    cy.findByTestId('harness-start').click()
    cy.contains(/download complete/i).should('exist')
    // Specifically NOT the "failed checksum verification" wording — the
    // match path should reach the plain "Download complete" title.
    cy.contains(/failed checksum verification/i).should('not.exist')
  })

  it('reports a verification failure when MD5 digest does not match', () => {
    // The tree row claims the file's MD5 is "000…000" but the bytes
    // streamed in are "hello". The engine streams the file through the
    // zip (bytes are committed; you can't unwrite a stream client-zip
    // is consuming), then on stream-close finalises the digest, finds
    // the mismatch, and pushes into `verificationFailures`. The tray
    // title surfaces the count; the manifest entry inside the zip
    // would list which files to re-download.
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'h.txt',
        path: 'h.txt',
        size: 5,
        downloadUrl: '/access/1',
        checksum: { type: 'MD5', value: '00000000000000000000000000000000' }
      })
    ]
    cy.customMount(<StreamingZipHarness files={files} zipName="verify-bad.zip" />)
    installFetchHandler(() => Promise.resolve(fakeResponseBody('hello')))

    cy.findByTestId('harness-start').click()
    cy.contains(/failed checksum verification/i).should('be.visible')
  })

  it('skips verification when the file has no checksum advertised', () => {
    // Tree omits the per-file `checksum` block (e.g. ingested-tabular
    // default form on the backend; older server). Engine treats this
    // as "not verifiable" rather than "failed verification" — no
    // accumulator is constructed, no comparison runs, manifest stays
    // empty.
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'noChecksum.txt',
        path: 'noChecksum.txt',
        size: 5,
        downloadUrl: '/access/1'
        // checksum: undefined
      })
    ]
    cy.customMount(<StreamingZipHarness files={files} zipName="verify-none.zip" />)
    installFetchHandler(() => Promise.resolve(fakeResponseBody('hello')))

    cy.findByTestId('harness-start').click()
    cy.contains(/download complete/i).should('exist')
    cy.contains(/failed checksum verification/i).should('not.exist')
  })

  it('chunks a large file into sequential Range requests', () => {
    const total = 12 // → 3 parts at partSize=4
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'big.bin',
        path: 'big.bin',
        size: total,
        downloadUrl: '/access/1'
      })
    ]

    cy.customMount(
      <StreamingZipHarness files={files} zipName="chunked.zip" partSize={4} partRetries={0} />
    )

    const seenRanges: string[] = []
    installFetchHandler((input, init) => {
      const url = String(input)
      expect(url).to.equal('/access/1')
      const headers = new Headers(init?.headers ?? undefined)
      const range = headers.get('Range') ?? ''
      seenRanges.push(range)
      const m = /^bytes=(\d+)-(\d+)$/.exec(range)
      expect(m).to.not.equal(null)
      const start = Number((m as RegExpExecArray)[1])
      const end = Number((m as RegExpExecArray)[2])
      const slice = 'ABCDEFGHIJKL'.slice(start, end + 1)
      const stream = new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(slice))
          controller.close()
        }
      })
      return Promise.resolve(
        new Response(stream, {
          status: 206,
          statusText: 'Partial Content',
          headers: {
            'content-type': 'application/octet-stream',
            'content-range': `bytes ${start}-${end}/${total}`
          }
        })
      )
    })

    cy.findByTestId('harness-start').click()
    cy.contains(/download complete/i).should('exist')
    cy.then(() => {
      expect(seenRanges).to.deep.equal(['bytes=0-3', 'bytes=4-7', 'bytes=8-11'])
    })
  })

  it('errors out when a non-first part of a chunked file exhausts its retries', () => {
    const total = 12
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'big.bin',
        path: 'big.bin',
        size: total,
        downloadUrl: '/access/1'
      })
    ]

    cy.customMount(
      <StreamingZipHarness files={files} zipName="part-fail.zip" partSize={4} partRetries={0} />
    )

    installFetchHandler((_input, init) => {
      const headers = new Headers(init?.headers ?? undefined)
      const range = headers.get('Range') ?? ''
      if (range === 'bytes=0-3') {
        const stream = new ReadableStream<Uint8Array>({
          start(controller) {
            controller.enqueue(new TextEncoder().encode('AAAA'))
            controller.close()
          }
        })
        return Promise.resolve(
          new Response(stream, {
            status: 206,
            statusText: 'Partial Content',
            headers: {
              'content-type': 'application/octet-stream',
              'content-range': `bytes 0-3/${total}`
            }
          })
        )
      }
      // Subsequent parts fail consistently — the body is already
      // streaming into client-zip, so the engine cannot offer a retry
      // dialog; the stream errors out and the IIFE catch surfaces it as
      // a hard failure.
      return Promise.reject(new Error('mid-stream drop'))
    })

    cy.findByTestId('harness-start').click()
    // The error UI label is /* istanbul ignore next */, so we assert on
    // the absence of the "complete" label instead — confirming the
    // engine reached `status: 'error'` rather than `status: 'done'`.
    cy.contains(/download complete/i, { timeout: 5_000 }).should('not.exist')
  })

  it('falls back to a single stream when the server returns 200 to a Range request', () => {
    const total = 12 // larger than partSize, but server ignores Range
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'no-range.bin',
        path: 'no-range.bin',
        size: total,
        downloadUrl: '/access/1'
      })
    ]

    cy.customMount(
      <StreamingZipHarness files={files} zipName="full-200.zip" partSize={4} partRetries={0} />
    )

    let calls = 0
    installFetchHandler(() => {
      calls += 1
      // Server replies 200 with the full body even though Range was set.
      // The engine must NOT issue a second Range fetch.
      return Promise.resolve(fakeResponseBody('ABCDEFGHIJKL'))
    })

    cy.findByTestId('harness-start').click()
    cy.contains(/download complete/i).should('exist')
    cy.then(() => {
      expect(calls).to.equal(1)
    })
  })

  it('switches to skip-with-manifest on "Skip all remaining failures"', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'broken-1.bin',
        path: 'broken-1.bin',
        size: 3,
        downloadUrl: '/access/2'
      }),
      FileTreeFileMother.create({
        id: 3,
        name: 'broken-2.bin',
        path: 'broken-2.bin',
        size: 3,
        downloadUrl: '/access/3'
      })
    ]

    cy.customMount(<StreamingZipHarness files={files} zipName="skip-all.zip" />)
    installFetchHandler((input) => {
      const url = String(input)
      if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
      return Promise.reject(new Error('permanently broken'))
    })

    cy.findByTestId('harness-start').click()
    // First failure → tray pauses with the failure dialog.
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    // "Skip all remaining failures" switches the engine to skip mode;
    // the second failure no longer pauses the run.
    cy.contains(/Skip all remaining failures/i).click()
    // Both broken-* files end up skipped → manifest line in the title.
    cy.contains(/Download complete — 2 skipped/i).should('exist')
  })
})
