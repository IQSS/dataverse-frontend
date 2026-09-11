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
7. **Honest limits.** A browser that cannot stream gets a hard cap and a plain
   message before anything is fetched, never an error at the end. Mobile is
   always capped.
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

`zipServiceWorkerUrl` overrides where the script is fetched from, and
`zipServiceWorkerScope` the scope it claims. Neither is needed for the mounts
above. A worker may only claim a scope _above_ its own directory if the server
sends a `Service-Worker-Allowed` header for it, which is why the defaults keep
the scope at the directory the script is served from.

## Failure handling

The engine must fail loudly rather than hang or truncate.

- The zip stream is **errored**, never closed, when a run is cancelled or
  superseded. A cleanly closed stream would be finalised by the browser as a
  complete download of a partial archive.
- The worker handshake times out after 10 s, and a download the browser never
  starts reading is abandoned after 60 s. Both unregister the pending stream in
  the worker and cancel the source, so nothing is left half-open.
- Chunks handed to the worker over the MessageChannel are **copied before being
  transferred**. client-zip accumulates the size of each central-directory
  record after yielding it, so transferring the caller's buffer detaches it, the
  record counts as zero bytes, and the end-of-central-directory record is
  written wrong. The archive then opens as empty.

## Caps

Named in `zipDownloadLimits.ts` and checked before the first byte is requested.

| Platform                          | Cap                                          |
| --------------------------------- | -------------------------------------------- |
| Desktop, streaming sink available | none                                         |
| Desktop, buffered fallback        | 2 GB                                         |
| iOS                               | 1 GB, whatever the browser reports it can do |
| Android                           | 2 GB, whatever the browser reports it can do |

Mobile is a product decision rather than a capability one, which is why the cap
holds even where the service worker works.

The over-cap message distinguishes a browser that cannot stream at all, which is
told which browsers can, from a browser that could but is on a page without a
usable worker, which is not told to switch to the browser it is already using.
