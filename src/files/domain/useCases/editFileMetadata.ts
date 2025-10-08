import { FileRepository } from '../repositories/FileRepository'
import { FileMetadataDTO } from '@/files/domain/useCases/DTOs/FileMetadataDTO'

export function editFileMetadata(
  fileRepository: FileRepository,
  fileId: number | string,
  fileMetadata: FileMetadataDTO,
  sourceLastUpdateTime?: string
): Promise<void> {
  return fileRepository.updateMetadata(fileId, fileMetadata, sourceLastUpdateTime)
}
