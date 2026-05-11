import { AccessRepository, GuestbookResponseDTO } from '../repositories/AccessRepository'

export function submitGuestbookForDatafileDownload(
  accessRepository: AccessRepository,
  fileId: number | string,
  answers: GuestbookResponseDTO,
  format?: string
): Promise<string> {
  return accessRepository.submitGuestbookForDatafileDownload(fileId, answers, format)
}
