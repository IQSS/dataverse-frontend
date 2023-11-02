import { FileRepository } from '../repositories/FileRepository'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileCriteria } from '../models/FileCriteria'

export async function getFilesCountInfoByDatasetPersistentId(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion,
  criteria: FileCriteria = new FileCriteria()
): Promise<FilesCountInfo> {
  return fileRepository
    .getFilesCountInfoByDatasetPersistentId(datasetPersistentId, datasetVersion, criteria)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
