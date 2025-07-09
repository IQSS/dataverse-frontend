import { FileRepository } from '../repositories/FileRepository'

export function updateFileTabularTags(
  fileRepository: FileRepository,
  fileId: number | string,
  tabularTags: string[],
  replace?: boolean
): Promise<void> {
  return fileRepository.UpdateFileTabularTags(fileId, tabularTags, replace)
}
