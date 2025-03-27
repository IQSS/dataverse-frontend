import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetDeaccessionDTO } from '@iqss/dataverse-client-javascript'

export function deaccessionDataset(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  version: string,
  deaccessionDTO: DatasetDeaccessionDTO
): Promise<void> {
  return datasetRepository.deaccession(datasetId, version, deaccessionDTO).catch((error: Error) => {
    throw new Error(error.message)
  })
}
