import { CollectionSummary } from '@/collection/domain/models/CollectionSummary'
import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getDatasetLinkedCollections(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<CollectionSummary[]> {
  return datasetRepository.getDatasetLinkedCollections(datasetId)
}
