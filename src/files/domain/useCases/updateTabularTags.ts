import { FileRepository } from '../repositories/FileRepository'

export function updateTabularTags(
  fileRepository: FileRepository,
  fileId: number | string,
  tabularTags: string[],
  replace?: boolean
): Promise<void> {
  return fileRepository.updateTabularTags(fileId, tabularTags, replace)
}
