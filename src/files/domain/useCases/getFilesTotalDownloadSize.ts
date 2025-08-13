import { FileRepository } from '../repositories/FileRepository'
import { DatasetVersionNumber } from '../../../dataset/domain/models/Dataset'
import { FileCriteria } from '../models/FileCriteria'

export async function getFilesTotalDownloadSize(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersionNumber: DatasetVersionNumber,
  criteria?: FileCriteria,
  includeDeaccessioned?: boolean
): Promise<number> {
  return fileRepository
    .getFilesTotalDownloadSizeByDatasetPersistentId(
      datasetPersistentId,
      datasetVersionNumber,
      criteria,
      includeDeaccessioned
    )
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
