import { FileRepository } from '../repositories/FileRepository'

export async function getFile(
  fileRepository: FileRepository,
  id: number
): Promise<string | undefined> {
  return fileRepository.getById(id).catch((error: Error) => {
    throw new Error(error.message)
  })
}
