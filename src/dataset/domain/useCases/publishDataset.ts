import { DatasetRepository } from '../repositories/DatasetRepository'
import { VersionUpdateType } from '../models/VersionUpdateType'

export function publishDataset(
  datasetRepository: DatasetRepository,
  persistentId: string,
  versionUpdateType: VersionUpdateType
): Promise<void> {
  return datasetRepository.publish(persistentId, versionUpdateType).catch((error: Error) => {
    throw new Error(error.message)
  })
}
