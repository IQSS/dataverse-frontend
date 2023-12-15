import { FileRepository } from '../repositories/FileRepository'
import { FileDownloadMode } from '../models/FilePreview'

const ONLY_ONE_FILE = 1
export function getMultipleFileDownloadUrl(
  fileRepository: FileRepository,
  ids: number[],
  downloadMode: FileDownloadMode
): string {
  if (ids.length === ONLY_ONE_FILE) {
    return fileRepository.getFileDownloadUrl(ids[0], downloadMode)
  }

  return fileRepository.getMultipleFileDownloadUrl(ids, downloadMode)
}
