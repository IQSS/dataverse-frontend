import { FileUploadState } from '../models/FileUploadState'
import { FileRepository } from '../repositories/FileRepository'

export function addUploadedFiles(
  fileRepository: FileRepository,
  datasetId: number | string,
  files: FileUploadState[],
  done: () => void
): void {
  fileRepository
    .addUploadedFiles(datasetId, files)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
    .finally(done)
}

export function addUploadedFile(
  fileRepository: FileRepository,
  datasetId: number | string,
  file: File,
  storageId: string,
  done: () => void
): void {
  fileRepository
    .addUploadedFile(datasetId, { file: file }, storageId)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
    .finally(done)
}
