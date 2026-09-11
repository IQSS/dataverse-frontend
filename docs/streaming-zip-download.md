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

The service worker only answers a fake same-origin URL, `<scope>zipdl/<id>/<name>`.
Nothing serves that path; the worker intercepts it and replies with the zip
stream and a `Content-Disposition` attachment header. A service worker can only
intercept URLs inside its own scope, and its scope defaults to the directory the
worker script is served from, so where the script sits decides whether the
feature works at all.

| Mount                       | Worker served at                          | Page URL         | Result                                                           |
| --------------------------- | ----------------------------------------- | ---------------- | ---------------------------------------------------------------- |
| SPA, `base: '/modern'`      | `/modern/zip-download-sw.js`              | `/modern/...`    | Works as built. A renamed base moves both together.              |
| SPA behind a different base | `<base>/zip-download-sw.js`               | `<base>/...`     | Works as built.                                                  |
| Reusable components in JSF  | `/reusable-components/zip-download-sw.js` | `/dataset.xhtml` | **Needs configuration.** The page is outside the worker's scope. |

For the JSF mount, serve the worker script with a `Service-Worker-Allowed: /`
response header and set `zipServiceWorkerScope: '/'` in `window.dvTreeViewConfig`.
With nginx:

```nginx
location = /reusable-components/zip-download-sw.js {
    add_header Service-Worker-Allowed /;
}
```

Without that header the engine detects up front that the scope cannot cover the
page, skips the worker without waiting, and falls back to the buffered path with
its 2 GB cap. The download still works; it just stops streaming.

`zipServiceWorkerUrl` overrides where the script is fetched from, for
deployments that serve it somewhere else again.

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
