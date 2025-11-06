import { FileRepository } from '../repositories/FileRepository'
import { FileVersionSummarySubset } from '../models/FileVersionSummaryInfo'
import { FileVersionPaginationInfo } from '../models/FileVersionPaginationInfo'

export function getFileVersionSummaries(
  fileRepository: FileRepository,
  fileId: number | string,
  paginationInfo?: FileVersionPaginationInfo
): Promise<FileVersionSummarySubset> {
  return fileRepository.getFileVersionSummaries(fileId, paginationInfo)
}
