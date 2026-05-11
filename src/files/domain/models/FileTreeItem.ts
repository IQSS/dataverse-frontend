import { FileAccess } from './FileAccess'

export type FileAccessStatus = 'public' | 'restricted' | 'embargoed'

export enum FileTreeItemType {
  FOLDER = 'folder',
  FILE = 'file'
}

export interface FileTreeFolder {
  type: FileTreeItemType.FOLDER
  name: string
  path: string
  /**
   * Recursive aggregates over the folder's subtree. `bytes`, `restricted`,
   * and `embargoed` are individually optional so the SPA keeps rendering
   * against an older SDK (or a server that hasn't yet rolled out a given
   * aggregate) without a type-cast workaround. The previews-based
   * fallback also leaves them off — its counts are best-effort.
   */
  counts?: {
    files: number
    folders: number
    bytes?: number
    restricted?: number
    embargoed?: number
  }
}

export interface FileTreeFile {
  type: FileTreeItemType.FILE
  id: number
  name: string
  path: string
  size: number
  contentType?: string
  access?: FileAccess
  /**
   * Three-way access marker mirroring the per-file `access` string the
   * SDK exposes on the tree response: `'public' | 'restricted' |
   * 'embargoed'`. Kept separate from `access` (the boolean-ish
   * `FileAccess` object used elsewhere in the SPA) because that shape
   * collapses restricted and embargoed into the same `restricted: true`
   * flag — fine for permission gating, lossy for tree display.
   */
  accessStatus?: FileAccessStatus
  checksum?: { type: string; value: string }
  downloadUrl: string
}

export type FileTreeItem = FileTreeFolder | FileTreeFile

export const isFileTreeFolder = (item: FileTreeItem): item is FileTreeFolder =>
  item.type === FileTreeItemType.FOLDER

export const isFileTreeFile = (item: FileTreeItem): item is FileTreeFile =>
  item.type === FileTreeItemType.FILE
