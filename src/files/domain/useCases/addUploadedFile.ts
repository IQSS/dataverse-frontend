import { FileUploadState } from '../models/FileUploadState'
import { FileRepository } from '../repositories/FileRepository'

export function addUploadedFile(
  fileRepository: FileRepository,
  datasetId: number | string,
  file: FileUploadState,
  storageId: string
): void {
  fileRepository
    .addUploadedFile(datasetId, file, storageId)
    .then(() => {
      // console.log('File added to the dataset successfully.')
    })
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
