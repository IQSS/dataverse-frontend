import { AccessRepository, GuestbookResponseAnswer } from '../repositories/AccessRepository'

export function submitGuestbookForDatafilesDownload(
  accessRepository: AccessRepository,
  fileIds: Array<number | string>,
  answers: GuestbookResponseAnswer[]
): Promise<string> {
  return accessRepository.submitGuestbookForDatafilesDownload(fileIds, answers)
}
