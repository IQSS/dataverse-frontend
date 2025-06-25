import { FileRepository } from '../repositories/FileRepository'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { DatasetVersionNumber } from '../../../dataset/domain/models/Dataset'
import { FileCriteria } from '../models/FileCriteria'

export async function getFilesCountInfoByDatasetPersistentId(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersionNumber: DatasetVersionNumber,
  criteria: FileCriteria = new FileCriteria(),
  includeDeaccessioned?: boolean
): Promise<FilesCountInfo> {
  return fileRepository
    .getFilesCountInfoByDatasetPersistentId(
      datasetPersistentId,
      datasetVersionNumber,
      criteria,
      includeDeaccessioned
    )
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
