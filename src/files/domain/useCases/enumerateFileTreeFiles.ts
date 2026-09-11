import { FileTreeFile, isFileTreeFile, isFileTreeFolder } from '../models/FileTreeItem'
import { FileTreeRepository } from '../repositories/FileTreeRepository'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

export interface EnumerateFileTreeFilesParams {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  paths: string[]
  limit?: number
  signal?: AbortSignal
}

export async function enumerateFileTreeFiles(
  repository: FileTreeRepository,
  params: EnumerateFileTreeFilesParams
): Promise<FileTreeFile[]> {
  const { datasetPersistentId, datasetVersion, paths, limit = 500, signal } = params
  const collected: FileTreeFile[] = []
  const seen = new Set<number>()
  const queue = [...paths]

  while (queue.length > 0) {
    if (signal?.aborted) {
      throw new Error('Enumeration aborted')
    }
    const path = queue.shift() as string
    let cursor: string | undefined
    do {
      const page = await repository.getNode({
        datasetPersistentId,
        datasetVersion,
        path,
        limit,
        cursor
      })
      for (const item of page.items) {
        if (isFileTreeFile(item)) {
          if (!seen.has(item.id)) {
            seen.add(item.id)
            collected.push(item)
          }
        } else if (isFileTreeFolder(item)) {
          queue.push(item.path)
        }
      }
      cursor = page.nextCursor ?? undefined
    } while (cursor)
  }
  return collected
}
