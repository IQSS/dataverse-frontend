import { AccessRepository, GuestbookResponseAnswer } from '../repositories/AccessRepository'

export function submitGuestbookForDatafileDownload(
  accessRepository: AccessRepository,
  fileId: number | string,
  answers: GuestbookResponseAnswer[]
): Promise<string> {
  return accessRepository.submitGuestbookForDatafileDownload(fileId, answers)
}
