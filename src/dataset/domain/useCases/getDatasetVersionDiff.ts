import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetVersionDiff } from '../models/DatasetVersionDiff'

export async function getDatasetVersionDiff(
  datasetRepository: DatasetRepository,
  persistentId: string,
  oldVersion: string,
  newVersion: string
): Promise<DatasetVersionDiff | undefined> {
  return datasetRepository
    .getVersionDiff(persistentId, oldVersion, newVersion)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
