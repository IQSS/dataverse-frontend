import { FileRepository } from '../repositories/FileRepository'

export function updateCategories(
  fileRepository: FileRepository,
  fileId: number | string,
  categories: string[],
  replace?: boolean
): Promise<void> {
  return fileRepository.updateCategories(fileId, categories, replace)
}
