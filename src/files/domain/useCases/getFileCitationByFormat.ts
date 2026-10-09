import { FormattedFileCitation, FileCitationFormat } from '../models/FileCitation'
import { FileRepository } from '../repositories/FileRepository'

export function getFileCitationByFormat(
  fileRepository: FileRepository,
  fileId: string | number,
  format: FileCitationFormat
): Promise<FormattedFileCitation> {
  return fileRepository.getFileCitationByFormat(fileId, format)
}
