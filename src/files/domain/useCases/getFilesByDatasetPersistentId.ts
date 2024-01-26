import { FileRepository } from '../repositories/FileRepository'
import { FilePreview } from '../models/FilePreview'
import { FileCriteria } from '../models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../models/FilePaginationInfo'

export async function getFilesByDatasetPersistentId(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion,
  paginationInfo?: FilePaginationInfo,
  criteria?: FileCriteria
): Promise<FilePreview[]> {
  console.log('getFilesByDatasetPersistentId', datasetPersistentId, datasetVersion)
  return fileRepository
    .getAllByDatasetPersistentId(datasetPersistentId, datasetVersion, paginationInfo, criteria)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
