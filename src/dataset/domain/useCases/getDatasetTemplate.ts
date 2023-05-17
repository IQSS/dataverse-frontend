import { DatasetTemplateRepository } from '../repositories/DatasetTemplateRepository'
import { DatasetTemplate } from '../models/DatasetTemplate'

export async function getDatasetTemplate(
  datasetTemplateRepository: DatasetTemplateRepository,
  datasetTemplateId: string
): Promise<DatasetTemplate | undefined> {
  return datasetTemplateRepository.getById(datasetTemplateId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
