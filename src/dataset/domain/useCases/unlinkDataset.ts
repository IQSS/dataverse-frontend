import { DatasetRepository } from '../repositories/DatasetRepository'

export async function unlinkDataset(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  collectionIdOrAlias: string | number
): Promise<void> {
  return datasetRepository.unlink(datasetId, collectionIdOrAlias)
}
