import { DatasetRepository } from '../repositories/DatasetRepository'

export async function linkDataset(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  collectionIdOrAlias: string | number
): Promise<void> {
  return datasetRepository.link(datasetId, collectionIdOrAlias)
}
