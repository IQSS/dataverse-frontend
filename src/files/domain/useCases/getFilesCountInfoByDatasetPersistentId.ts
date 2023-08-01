import { FileRepository } from '../repositories/FileRepository'
import { FileVersionNotNumber } from '../models/File'
import { FilesCountInfo } from '../models/FilesCountInfo'

export async function getFilesCountInfoByDatasetPersistentId(
  fileRepository: FileRepository,
  persistentId: string,
  version: string = FileVersionNotNumber.LATEST
): Promise<FilesCountInfo> {
  return fileRepository
    .getCountInfoByDatasetPersistentId(persistentId, version)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
