import { FileRepository } from '../repositories/FileRepository'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

export async function getFilesTotalDownloadSize(
  fileRepository: FileRepository,
  datasetPersistentId: string,
  datasetVersion: DatasetVersion
): Promise<number> {
  return fileRepository
    .getFilesTotalDownloadSizeByDatasetPersistentId(datasetPersistentId, datasetVersion)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
