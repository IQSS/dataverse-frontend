import { FileRepository } from '../repositories/FileRepository'
import { File } from '../models/File'

export async function getFilesByDatasetPersistentId(
  fileRepository: FileRepository,
  persistentId: string,
  version?: string
): Promise<File[]> {
  return fileRepository.getAllByDatasetPersistentId(persistentId, version).catch((error: Error) => {
    throw new Error(error.message)
  })
}
