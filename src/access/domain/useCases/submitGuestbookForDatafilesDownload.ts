import { AccessRepository, GuestbookResponseDTO } from '../repositories/AccessRepository'

export function submitGuestbookForDatafilesDownload(
  accessRepository: AccessRepository,
  fileIds: Array<number>,
  answers: GuestbookResponseDTO
): Promise<string> {
  return accessRepository.submitGuestbookForDatafilesDownload(fileIds, answers)
}
