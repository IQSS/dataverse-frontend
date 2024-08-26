import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FileRepository } from '../repositories/FileRepository'

export function addUploadedFiles(
  fileRepository: FileRepository,
  datasetId: number | string,
  files: UploadedFileDTO[],
  done: () => void
): void {
  fileRepository
    .addUploadedFiles(datasetId, files)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
    .finally(done)
}
