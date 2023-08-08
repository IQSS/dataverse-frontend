import { FileRepository } from '../repositories/FileRepository'
import { File, FileVersionNotNumber } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilePaginationInfo } from '../models/FilePaginationInfo'

export async function getFilesByDatasetPersistentId(
  fileRepository: FileRepository,
  persistentId: string,
  version: string = FileVersionNotNumber.LATEST,
  paginationInfo?: FilePaginationInfo,
  criteria?: FileCriteria
): Promise<File[]> {
  return fileRepository
    .getAllByDatasetPersistentId(persistentId, version, paginationInfo, criteria)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
