import { FileTreePage } from '../models/FileTreePage'
import { FileTreeRepository, GetFileTreeNodeParams } from '../repositories/FileTreeRepository'

export function getFileTreeNode(
  repository: FileTreeRepository,
  params: GetFileTreeNodeParams
): Promise<FileTreePage> {
  return repository.getNode(params).catch(() => {
    throw new Error('There was an error getting the file tree node')
  })
}
