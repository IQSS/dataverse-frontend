import { DatasetExternalToolResolved } from '../models/DatasetExternalToolResolved'
import { ExternalToolsRepository } from '../repositories/ExternalToolsRepository'
import { GetExternalToolDTO } from './DTOs/GetExternalToolDTO'

export function getDatasetExternalToolResolved(
  externalToolsRepository: ExternalToolsRepository,
  datasetId: number | string,
  toolId: number,
  getExternalToolDTO: GetExternalToolDTO
): Promise<DatasetExternalToolResolved> {
  return externalToolsRepository.getDatasetExternalToolResolved(
    datasetId,
    toolId,
    getExternalToolDTO
  )
}
