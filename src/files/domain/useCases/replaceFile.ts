import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

/**
 * Minimal repository type for replaceFile.
 * Only requires the replace method.
 */
type ReplaceFileRepository = Pick<FileRepository, 'replace'>

export function replaceFile(
  fileRepository: ReplaceFileRepository,
  fileId: number | string,
  newFile: UploadedFileDTO
): Promise<number> {
  return fileRepository.replace(fileId, newFile)
}
