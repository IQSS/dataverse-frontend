import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetType } from '@iqss/dataverse-client-javascript'

export function getAvailableDatasetTypes(
  datasetRepository: DatasetRepository
): Promise<DatasetType[]> {
  return datasetRepository.getAvailableDatasetTypes()
}
