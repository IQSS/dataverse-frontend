import { DatasetRepository } from '../repositories/DatasetRepository'
import { Dataset } from '../models/Dataset'

export async function getDatasetByPrivateUrlToken(
  datasetRepository: DatasetRepository,
  privateUrlToken: string
): Promise<Dataset | undefined> {
  return datasetRepository.getByPrivateUrlToken(privateUrlToken).catch((error: Error) => {
    throw new Error(error.message)
  })
}
