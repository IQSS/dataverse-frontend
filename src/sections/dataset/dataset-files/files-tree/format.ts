import { FileSize, FileSizeUnit } from '@/files/domain/models/FileMetadata'
import { FileAccessStatus } from '@/files/domain/models/FileTreeItem'

export function formatBytes(input: number | undefined): string {
  if (input === undefined || input === null || Number.isNaN(input)) {
    return ''
  }
  return new FileSize(input, FileSizeUnit.BYTES).toString()
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

export type AccessVariant = Exclude<FileAccessStatus, 'public'>

export function fileAccessVariant(access: FileAccessStatus | undefined): AccessVariant | undefined {
  return access === undefined || access === 'public' ? undefined : access
}

export function folderAccessVariant(
  counts: { restricted?: number; embargoed?: number; retentionExpired?: number } | undefined
): AccessVariant | undefined {
  if ((counts?.retentionExpired ?? 0) > 0) return 'retentionExpired'
  if ((counts?.restricted ?? 0) > 0) return 'restricted'
  if ((counts?.embargoed ?? 0) > 0) return 'embargoed'
  return undefined
}

export function folderAccessParts(
  counts: { restricted?: number; embargoed?: number; retentionExpired?: number } | undefined
): { key: AccessVariant; count: number }[] {
  const parts: { key: AccessVariant; count: number }[] = []
  const restricted = counts?.restricted ?? 0
  const embargoed = counts?.embargoed ?? 0
  const retentionExpired = counts?.retentionExpired ?? 0
  if (restricted > 0) parts.push({ key: 'restricted', count: restricted })
  if (embargoed > 0) parts.push({ key: 'embargoed', count: embargoed })
  if (retentionExpired > 0) parts.push({ key: 'retentionExpired', count: retentionExpired })
  return parts
}
