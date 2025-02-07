import { FileRepository } from '../repositories/FileRepository'

export function deleteFile(fileRepository: FileRepository, fileId: number | string): Promise<void> {
  return fileRepository.deleteFile(fileId)
}
