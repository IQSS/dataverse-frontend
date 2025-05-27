import { FileRepository } from '../repositories/FileRepository'
import { FileVersionSummaryInfo } from '../models/FileVersionSummaryInfo'

export function getFileVersionSummaries(
  fileRepository: FileRepository,
  fileId: number | string
): Promise<FileVersionSummaryInfo[]> {
  return fileRepository.getFileVersionSummaries(fileId)
}
