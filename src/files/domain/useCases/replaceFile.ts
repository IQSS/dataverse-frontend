import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

export function replaceFile(
  fileRepository: FileRepository,
  fileId: number | string,
  newFile: UploadedFileDTO
): Promise<void> {
  return fileRepository.replace(fileId, newFile)
}
