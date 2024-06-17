import { FileUploadState } from '../models/FileUploadState'
import { FileRepository } from '../repositories/FileRepository'

export function addUploadedFile(
  fileRepository: FileRepository,
  datasetId: number | string,
  files: FileUploadState[],
  done: () => void
): void {
  fileRepository
    .addUploadedFile(datasetId, files)
    .then(() => {
      done()
    })
    .catch((error: Error) => {
      done()
      throw new Error(error.message)
    })
}
