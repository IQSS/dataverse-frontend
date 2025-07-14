import { FileRepository } from '../repositories/FileRepository'

export function updateFileCategories(
  fileRepository: FileRepository,
  fileId: number | string,
  categories: string[],
  replace?: boolean
): Promise<void> {
  return fileRepository.updateFileCategories(fileId, categories, replace)
}
