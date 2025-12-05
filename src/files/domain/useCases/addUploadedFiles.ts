import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

/**
 * Minimal repository type for addUploadedFiles.
 * Only requires the addUploadedFiles method.
 */
type AddUploadedFilesRepository = Pick<FileRepository, 'addUploadedFiles'>

export function addUploadedFiles(
  fileRepository: AddUploadedFilesRepository,
  datasetId: number | string,
  files: UploadedFileDTO[]
): Promise<void> {
  return fileRepository.addUploadedFiles(datasetId, files)
}
