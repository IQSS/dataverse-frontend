import { FileRepository } from '../repositories/FileRepository'
import { File, FileVersionNotNumber } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'

export async function getFilesByDatasetPersistentId(
  fileRepository: FileRepository,
  persistentId: string,
  version: string = FileVersionNotNumber.LATEST,
  criteria?: FileCriteria
): Promise<File[]> {
  return fileRepository
    .getAllByDatasetPersistentId(persistentId, version, criteria)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
