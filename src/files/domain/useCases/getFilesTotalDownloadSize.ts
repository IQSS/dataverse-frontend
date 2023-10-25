import { FileRepository } from '../repositories/FileRepository'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileCriteria } from '../models/FileCriteria'

export async function getFilesTotalDownloadSize(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion,
  criteria?: FileCriteria
): Promise<number> {
  return fileRepository
    .getFilesTotalDownloadSizeByDatasetPersistentId(datasetPersistentId, datasetVersion, criteria)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
