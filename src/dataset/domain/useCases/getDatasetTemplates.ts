import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetTemplate } from '../models/DatasetTemplate'

export function getDatasetTemplates(
  datasetRepository: DatasetRepository,
  collectionIdOrAlias: number | string
): Promise<DatasetTemplate[]> {
  return datasetRepository.getTemplates(collectionIdOrAlias)
}
