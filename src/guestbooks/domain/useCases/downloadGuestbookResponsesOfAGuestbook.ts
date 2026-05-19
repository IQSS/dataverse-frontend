import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function downloadGuestbookResponsesOfAGuestbook(
  guestbookRepository: GuestbookRepository,
  dataverseId: number | string,
  guestbookId: number
): Promise<string> {
  return guestbookRepository.downloadGuestbookResponsesOfAGuestbook(dataverseId, guestbookId)
}
