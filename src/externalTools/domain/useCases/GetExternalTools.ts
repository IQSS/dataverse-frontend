import { ExternalTool } from '../models/ExternalTool'
import { ExternalToolsRepository } from '../repositories/ExternalToolsRepository'

export function getExternalTools(
  externalToolsRepository: ExternalToolsRepository
): Promise<ExternalTool[]> {
  return externalToolsRepository.getExternalTools()
}
