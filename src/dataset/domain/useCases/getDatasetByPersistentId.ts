import { DatasetRepository } from '../repositories/DatasetRepository'
import { Dataset } from '../models/Dataset'

export async function getDatasetByPersistentId(
  datasetRepository: DatasetRepository,
  persistentId: string,
  version?: string,
  requestedVersion?: string,
  keepRawFields?: boolean,
  fetchDownloadSizesIncludeDeaccessioned?: boolean
): Promise<Dataset | undefined> {
  return datasetRepository
    .getByPersistentId(
      persistentId,
      version,
      requestedVersion,
      keepRawFields,
      fetchDownloadSizesIncludeDeaccessioned
    )
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
