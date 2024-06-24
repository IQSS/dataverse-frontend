import { FileRepository } from '../repositories/FileRepository'
import { FileCriteria } from '../models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../models/FilePaginationInfo'
import { FilesWithCount } from '../models/FilesWithCount'

export async function getFilesByDatasetPersistentIdWithCount(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion,
  paginationInfo?: FilePaginationInfo,
  criteria?: FileCriteria
): Promise<FilesWithCount> {
  return fileRepository
    .getAllByDatasetPersistentIdWithCount(
      datasetPersistentId,
      datasetVersion,
      paginationInfo,
      criteria
    )
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
