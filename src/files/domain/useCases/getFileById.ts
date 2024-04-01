import { FileRepository } from '../repositories/FileRepository'
import { File } from '../models/File'

export async function getFileById(
  repository: FileRepository,
  id: number,
  datasetVersionNumber?: string
): Promise<File | undefined> {
  return repository.getById(id, datasetVersionNumber).catch((error: Error) => {
    throw new Error(error.message)
  })
}
