import { FileRepository } from '../repositories/FileRepository'

export function restrictFile(
  fileRepository: FileRepository,
  fileId: number | string,
  restrict: boolean
): Promise<void> {
  return fileRepository.restrict(fileId, restrict)
}
