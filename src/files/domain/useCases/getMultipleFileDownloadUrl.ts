import { FileRepository } from '../repositories/FileRepository'
import { FileDownloadMode } from '../models/File'

export function getMultipleFileDownloadUrl(
  fileRepository: FileRepository,
  ids: number[],
  downloadMode: FileDownloadMode
): string {
  return fileRepository.getMultipleFileDownloadUrl(ids, downloadMode)
}
