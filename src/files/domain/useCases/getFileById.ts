import { FileRepository } from '../repositories/FileRepository'
import { File } from '../models/File'

export async function getFileById(
  repository: FileRepository,
  id: number
): Promise<File | undefined> {
  return repository.getById(id).catch((error: Error) => {
    throw new Error(error.message)
  })
}
