import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '../repositories/DatasetRepository'

export function deleteDataset(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<void> {
  return datasetRepository.deleteDataset(datasetId).catch((error: WriteError | unknown) => {
    throw error
  })
}
