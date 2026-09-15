# Streaming zip download

What the tree view's multi-file download has to do, and what it is checked
against. Anything that stops holding is a bug, not a preference.

## Goals

1. **Flat memory.** A selection larger than the machine's RAM downloads
   successfully. Nothing, not the archive and not a single file, is ever held
   whole in the tab.
2. **One interaction.** A selection of any shape downloads with one click and
   arrives as one archive with the dataset's folder tree intact.
3. **Resumable at the byte.** A chunk that fails is re-requested from the exact
   byte already delivered, through a fresh URL when the old one expired, without
   losing the parts already written.
4. **No silent truncation.** A download that fails is reported as failed by the
   browser. A short or corrupt archive must never look like a success.
5. **Every deployment, not just S3.** See the matrix below.
6. **Every mount, not just the SPA.** See the matrix below.
7. **Honest limits, by capability.** A browser that cannot stream gets a hard cap
   and a plain message before anything is fetched, never an error at the end. The
   cap follows what the browser can do, never what kind of device it runs on.
8. **Verified bytes.** Checksums are computed as the bytes pass, never by
   buffering the file.

## Storage matrix

| Deployment                                                              | Byte source                                                                          | What the engine does                                                                                                |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| S3 with `download-redirect=true`                                        | 303 from `/api/access/datafile/{id}` to a presigned URL                              | Caches the redirected URL for parts 2..N, strips `Authorization` cross-origin, re-presigns on 403 via `gbrecs=true` |
| S3 or local storage without `download-redirect`                         | Bytes proxied through Payara, same origin                                            | Same path, no redirect, `Authorization` kept, a 403 is a real denial                                                |
| Server that ignores `Range`                                             | 200 with the whole body                                                              | Streams the single body; a mid-body drop cannot be resumed and aborts the run                                       |
| Content with an unknown size (generated streams, remote/overlay stores) | Dataverse answers a ranged request with 404, or 416 if the range cannot be satisfied | Retries once without the `Range` header and streams the whole file                                                  |

Files at or under the part size (10 MB) are fetched unranged to begin with, so
only larger files exercise the ranged paths.

Transient request failures and interrupted/short ranged response bodies use
the existing `partRetries` and `partRetryDelayMs` settings (defaults: three
retries, 500 ms between attempts). A body retry resumes at the exact byte already
delivered. Its budget resets after a complete range response, not after partial
progress, so a repeatedly failing body eventually pauses for Retry or Abort.
Manual Retry renews that budget. Request failures already exhausted by the
request retry loop go straight to the existing prompt; cancellation interrupts
the retry delay. This does not recreate a browser download destination that
has already closed.

## Mount matrix

The service worker answers a fake same-origin URL, `<scope>zipdl/<id>/<name>`.
Nothing serves that path; the worker intercepts it and replies with the zip
stream and a `Content-Disposition` attachment header.

The page does not have to be inside the worker's scope. Scope decides which
pages a worker _controls_, but a navigation is matched to a worker by its target
URL, and the download URL is built from the worker's own scope, so it is always
inside it. The stream is handed over with `registration.active.postMessage`,
which needs no control either. That is why a JSF page at `/dataset.xhtml` works
with a worker served from `/reusable-components/`.

| Mount                       | Worker served at                          | Page URL         | Result                                                                      |
| --------------------------- | ----------------------------------------- | ---------------- | --------------------------------------------------------------------------- |
| SPA, `base: '/modern'`      | `/modern/zip-download-sw.js`              | `/modern/...`    | works as built                                                              |
| SPA behind a different base | `<base>/zip-download-sw.js`               | `<base>/...`     | works as built, the base moves both together                                |
| Reusable components in JSF  | `/reusable-components/zip-download-sw.js` | `/dataset.xhtml` | works as built, page is outside the scope and does not need to be inside it |

The page talks to the worker by message, never by `fetch`. A `fetch` from an
uncontrolled page goes straight to the network and never reaches the worker, so
the capability probe and the keepalive are both `postMessage` round trips.

`zipServiceWorkerUrl` overrides where the script is fetched from; the scope is
always the directory the script is served from, which is all the download URL
needs.

## Failure handling

The engine must fail loudly rather than hang or truncate.

- The zip stream is **errored**, never closed, when a run is cancelled or
  superseded, including a cancel taken from the paused dialog before an entry
  has started. A cleanly closed stream would be finalised by the browser as a
  complete download of a partial archive.
- The worker handshake times out after 10 s, and a download the browser never
  starts reading is abandoned after 60 s. Both unregister the pending stream in
  the worker and cancel the source, so nothing is left half-open. There is
  deliberately no timeout once bytes are flowing: a slow server is legitimate,
  and aborting a running download would be worse than waiting.
- Chunks handed to the worker over the MessageChannel are **copied before being
  transferred**. client-zip accumulates the size of each central-directory
  record after yielding it, so transferring the caller's buffer detaches it, the
  record counts as zero bytes, and the end-of-central-directory record is
  written wrong. The archive then opens as empty.

## Caps

The cap follows capability, not device class. There is no user-agent sniffing
and no per-platform rule.

| Sink                                       | Cap                           |
| ------------------------------------------ | ----------------------------- |
| Streams to disk through the service worker | none                          |
| Has to buffer the archive in memory        | 2 GB, `BUFFERED_ZIP_SIZE_CAP` |

A phone whose browser can stream is not capped. A desktop browser that cannot is.
If a device gains the capability, it starts working without a code change, which
is the point.

The selection is checked against the cap before the first byte is requested, so
an over-cap selection is refused up front rather than failing at the end.

The over-cap message distinguishes a browser that cannot stream at all, which is
told which browsers can, from a browser that could but is on a page without a
usable worker, which is not told to switch to the browser it is already using.

## Download worker protocol and completion

Protocol 2 requires the worker to acknowledge registration and response-body
completion with the number of ZIP bytes consumed. The producer checks this count
before resolving `save()`. This confirms stream delivery, not a filesystem flush
or saved-file integrity. Old pages still work with the new worker; a new page
rejects an older worker clearly and asks for reload rather than dropping flow control.

MessageChannel delivery remains pull-driven and splits outgoing views into at
most 256 KiB messages. It clones chunks by default; `transferChunks` allows an
explicit comparison. The worker also splits transferred-stream chunks before
forwarding them to the download response. A single current producer chunk can
still be retained while its pieces are consumed; the adapter does not accumulate
the whole archive. Setup errors, source failures, caller aborts and browser
cancellation clean up ports, registration, timers and unfinished production.

`expectedBytes` is optional and must be the exact final ZIP length, including
headers, directory and any manifest. The worker declares `Content-Length` only
when supplied and rejects shorter or longer bodies. Normal Dataverse downloads
omit it because skipped files and late warning manifests can change the result.
Do not use payload totals or an inflated estimate as the header value.

`onEvent` exposes bounded-size cancellation reasons and worker lifecycle/byte
observations for diagnostics. `holdWorkerUntilComplete` is an opt-in experiment
that extends the fetch event until the body ends; production leaves it disabled
because browser event deadlines can break otherwise working long downloads.
The sink retains its existing page keepalives. Neither option provides recovery
of a closed browser download, or establishes offline/sleep support in Firefox
or Safari. The spike records options and verifies the separately saved ZIP.
