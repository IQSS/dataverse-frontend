import { FileExternalToolResolved } from '../models/FileExternalToolResolved'
import { ExternalToolsRepository } from '../repositories/ExternalToolsRepository'
import { GetExternalToolDTO } from './DTOs/GetExternalToolDTO'

export function getFileExternalToolResolved(
  externalToolsRepository: ExternalToolsRepository,
  fileId: number | string,
  toolId: number,
  getExternalToolDTO: GetExternalToolDTO
): Promise<FileExternalToolResolved> {
  return externalToolsRepository.getFileExternalToolResolved(fileId, toolId, getExternalToolDTO)
}
