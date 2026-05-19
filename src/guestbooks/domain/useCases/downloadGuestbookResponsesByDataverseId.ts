import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function downloadGuestbookResponsesByDataverseId(
  guestbookRepository: GuestbookRepository,
  dataverseId: number | string
): Promise<string> {
  return guestbookRepository.downloadGuestbookResponsesByDataverseId(dataverseId)
}
