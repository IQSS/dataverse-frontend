import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetType } from '@iqss/dataverse-client-javascript'

export function getDatasetTypeByNameOrId(
  datasetRepository: DatasetRepository,
  nameOrId: string | number
): Promise<DatasetType> {
  return datasetRepository.getDatasetTypeByNameOrId(nameOrId)
}
