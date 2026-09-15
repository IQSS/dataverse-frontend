import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

type AddUploadedFilesRepository = Pick<FileRepository, 'addUploadedFiles'>

export function addUploadedFiles(
  fileRepository: AddUploadedFilesRepository,
  datasetId: number | string,
  files: UploadedFileDTO[]
): Promise<void> {
  return fileRepository.addUploadedFiles(datasetId, files)
}
