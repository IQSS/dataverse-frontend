import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

export function addUploadedFiles(
  fileRepository: FileRepository,
  datasetId: number | string,
  files: UploadedFileDTO[]
): Promise<void> {
  return fileRepository.addUploadedFiles(datasetId, files)
}
