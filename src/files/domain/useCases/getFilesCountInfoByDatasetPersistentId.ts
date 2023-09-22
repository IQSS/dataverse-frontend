import { FileRepository } from '../repositories/FileRepository'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

export async function getFilesCountInfoByDatasetPersistentId(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion
): Promise<FilesCountInfo> {
  return fileRepository
    .getCountInfoByDatasetPersistentId(datasetPersistentId, datasetVersion)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
