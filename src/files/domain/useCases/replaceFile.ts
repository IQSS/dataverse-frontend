import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

type ReplaceFileRepository = Pick<FileRepository, 'replace'>

export function replaceFile(
  fileRepository: ReplaceFileRepository,
  fileId: number | string,
  newFile: UploadedFileDTO
): Promise<number> {
  return fileRepository.replace(fileId, newFile)
}
