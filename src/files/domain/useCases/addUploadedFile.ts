import { FileUploadState } from '../models/FileUploadState'
import { FileRepository } from '../repositories/FileRepository'

export function addUploadedFile(
  fileRepository: FileRepository,
  datasetId: number | string,
  files: FileUploadState[]
): void {
  fileRepository
    .addUploadedFile(datasetId, files)
    .then(() => {
      // console.log('File added to the dataset successfully.')
    })
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
