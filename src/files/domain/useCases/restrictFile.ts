import { FileRepository } from '../repositories/FileRepository'
import { RestrictFileDTO } from './restrictFileDTO'

export function restrictFile(
  fileRepository: FileRepository,
  fileId: number | string,
  restrictFileDTO: RestrictFileDTO
): Promise<void> {
  return fileRepository.restrict(fileId, restrictFileDTO)
}
