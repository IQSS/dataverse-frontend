export function formatBytes(input: number | undefined): string {
  if (input === undefined || input === null || Number.isNaN(input)) {
    return ''
  }
  if (input < 1024) {
    return `${input} B`
  }
  if (input < 1024 * 1024) {
    return `${(input / 1024).toFixed(1)} KB`
  }
  if (input < 1024 * 1024 * 1024) {
    return `${(input / (1024 * 1024)).toFixed(1)} MB`
  }
  return `${(input / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function formatCount(input: number | undefined): string {
  if (input === undefined || input === null || Number.isNaN(input)) {
    return ''
  }
  if (input < 1000) {
    return input.toString()
  }
  return `${(input / 1000).toFixed(1)}k`
}

export type FileAccessStatus = 'public' | 'restricted' | 'embargoed'

/**
 * Per-file access label. Empty string when access is unknown (e.g.
 * older server / SDK that didn't surface the field). Capitalised so the
 * tree row can render it as a self-contained word; the SCSS layer adds
 * the colour cue for restricted / embargoed.
 */
export function formatFileAccess(access: FileAccessStatus | undefined): string {
  if (!access) return ''
  return access[0].toUpperCase() + access.slice(1)
}

/**
 * Folder-row access cell. Mirrors the per-file resolution recursively
 * over the subtree: a folder with any restricted file gets a "restricted"
 * count, a folder with any non-restricted-but-actively-embargoed file
 * gets an "embargoed" count, both can co-exist. All-public folders
 * intentionally render as empty string so the column reads as
 * "anything here that the user should know about?" — public is the
 * default, no extra noise needed.
 */
export function formatFolderAccess(
  counts: { restricted?: number; embargoed?: number } | undefined
): string {
  const r = counts?.restricted ?? 0
  const e = counts?.embargoed ?? 0
  if (r > 0 && e > 0) return `${r} restricted · ${e} embargoed`
  if (r > 0) return `${r} restricted`
  if (e > 0) return `${e} embargoed`
  return ''
}
