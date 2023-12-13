import { FileRepository } from '../repositories/FileRepository'
import { File } from '../models/File'

export async function getFileById(repository: FileRepository, id: number): Promise<File> {
  return repository.getById(id).catch((error: Error) => {
    throw new Error(error.message)
  })
}
