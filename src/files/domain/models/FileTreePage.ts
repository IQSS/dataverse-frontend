import { FileTreeItem } from './FileTreeItem'

export enum FileTreeInclude {
  ALL = 'all',
  FOLDERS = 'folders',
  FILES = 'files'
}

export enum FileTreeOrder {
  NAME_AZ = 'NameAZ',
  NAME_ZA = 'NameZA'
}

export interface FileTreePage {
  path: string
  items: FileTreeItem[]
  nextCursor: string | null
  limit: number
  order: FileTreeOrder
  include: FileTreeInclude
  approximateCount?: number
}
