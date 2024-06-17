import { FileRepository } from '../repositories/FileRepository'

export function addUploadedFile(
  fileRepository: FileRepository,
  datasetId: number | string,
  file: File,
  storageId: string
): void {
  fileRepository
    .addUploadedFile(datasetId, { file: file }, storageId)
    .then(() => {
      // console.log('File added to the dataset successfully.')
    })
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
