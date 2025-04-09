import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetVersionDiff } from '../models/DatasetVersionDiff'

export async function getDatasetVersionDiff(
  datasetRepository: DatasetRepository,
  persistentId: string,
  oldVersion: string,
  newVersion: string,
  includeDeaccessioned: boolean
): Promise<DatasetVersionDiff | undefined> {
  return datasetRepository
    .getVersionDiff(persistentId, oldVersion, newVersion, includeDeaccessioned)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
