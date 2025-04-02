import { FileRepository } from '../repositories/FileRepository'
import { RestrictDTO } from './restrictFileDTO'

export function restrictFile(
  fileRepository: FileRepository,
  fileId: number | string,
  restrictDTO: RestrictDTO
): Promise<void> {
  return fileRepository.restrict(fileId, restrictDTO)
}
