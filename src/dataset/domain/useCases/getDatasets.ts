import { DatasetRepository } from '../repositories/DatasetRepository'
import { Dataset } from '../models/Dataset'

export async function getDatasets(datasetRepository: DatasetRepository): Promise<Dataset[]> {
  return datasetRepository.getAll().catch((error: Error) => {
    throw new Error(error.message)
  })
}
