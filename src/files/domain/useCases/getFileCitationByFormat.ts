import { DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { FormattedFileCitation, FileCitationFormat } from '../models/FileCitation'
import { FileRepository } from '../repositories/FileRepository'

export function getFileCitationByFormat(
  fileRepository: FileRepository,
  fileId: string | number,
  format: FileCitationFormat,
  versionNumber?: DatasetVersionNumber
): Promise<FormattedFileCitation> {
  return fileRepository.getFileCitationByFormat(fileId, format, versionNumber)
}
