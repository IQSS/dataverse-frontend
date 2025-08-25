import { FileExternalToolUrl } from '../models/FileExternalToolUrl'
import { ExternalToolsRepository } from '../repositories/ExternalToolsRepository'
import { GetExternalToolDTO } from './DTOs/GetExternalToolUrlDTO'

export function getFileExternalToolUrl(
  externalToolsRepository: ExternalToolsRepository,
  fileId: number | string,
  toolId: number,
  getExternalToolDTO: GetExternalToolDTO
): Promise<FileExternalToolUrl> {
  return externalToolsRepository.getFileExternalToolUrl(fileId, toolId, getExternalToolDTO)
}
