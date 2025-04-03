import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

export function replaceFile(
  fileRepository: FileRepository,
  fileId: number | string,
  newFile: UploadedFileDTO
): Promise<number> {
  return fileRepository.replace(fileId, newFile)
}
