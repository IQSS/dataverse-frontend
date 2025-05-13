import { FileRepository } from '../repositories/FileRepository'
import { FileVersionSummaryInfo } from '../models/FileVersionSummaryInfo'

export function getFileVersionSummaries(
  repository: FileRepository,
  fileId: number | string
): Promise<FileVersionSummaryInfo[]> {
  return repository.getFileVersionSummaries(fileId)
}
