import type { GetFileExternalToolDTO } from '@iqss/dataverse-client-javascript'
import { FileExternalToolResolved } from '../models/FileExternalToolResolved'
import { ExternalToolsRepository } from '../repositories/ExternalToolsRepository'

export function getFileExternalToolResolved(
  externalToolsRepository: ExternalToolsRepository,
  fileId: number | string,
  toolId: number,
  getExternalToolDTO: GetFileExternalToolDTO
): Promise<FileExternalToolResolved> {
  return externalToolsRepository.getFileExternalToolResolved(fileId, toolId, getExternalToolDTO)
}
