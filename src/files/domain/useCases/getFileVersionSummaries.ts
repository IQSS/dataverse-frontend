import { FileRepository } from '../repositories/FileRepository'
import { FileVersionSummarySubset } from '../models/FileVersionSummaryInfo'

export function getFileVersionSummaries(
  fileRepository: FileRepository,
  fileId: number | string,
  limit?: number,
  offset?: number
): Promise<FileVersionSummarySubset> {
  return fileRepository.getFileVersionSummaries(fileId, limit, offset)
}
