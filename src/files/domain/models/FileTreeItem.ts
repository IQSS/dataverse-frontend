import { FileAccess } from './FileAccess'

export enum FileTreeItemType {
  FOLDER = 'folder',
  FILE = 'file'
}

export interface FileTreeFolder {
  type: FileTreeItemType.FOLDER
  name: string
  path: string
  counts?: { files: number; folders: number }
}

export interface FileTreeFile {
  type: FileTreeItemType.FILE
  id: number
  name: string
  path: string
  size: number
  contentType?: string
  access?: FileAccess
  checksum?: { type: string; value: string }
  downloadUrl: string
}

export type FileTreeItem = FileTreeFolder | FileTreeFile

export const isFileTreeFolder = (item: FileTreeItem): item is FileTreeFolder =>
  item.type === FileTreeItemType.FOLDER

export const isFileTreeFile = (item: FileTreeItem): item is FileTreeFile =>
  item.type === FileTreeItemType.FILE
