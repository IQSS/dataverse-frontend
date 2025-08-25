import { DatasetExternalToolResolved } from '../models/DatasetExternalToolResolved'
import { ExternalToolsRepository } from '../repositories/ExternalToolsRepository'
import { GetExternalToolDTO } from './DTOs/GetExternalToolUrlDTO'

export function getDatasetExternalToolUrl(
  externalToolsRepository: ExternalToolsRepository,
  datasetId: number | string,
  toolId: number,
  getExternalToolDTO: GetExternalToolDTO
): Promise<DatasetExternalToolResolved> {
  return externalToolsRepository.getDatasetExternalToolUrl(datasetId, toolId, getExternalToolDTO)
}
