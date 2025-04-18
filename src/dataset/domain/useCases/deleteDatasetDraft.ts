import { WriteError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '../repositories/DatasetRepository'

export function deleteDatasetDraft(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<void> {
  return datasetRepository.deleteDatasetDraft(datasetId).catch((error: WriteError | unknown) => {
    throw error
  })
}
