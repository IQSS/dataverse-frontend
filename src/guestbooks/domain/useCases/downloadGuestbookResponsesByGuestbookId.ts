import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function downloadGuestbookResponsesByGuestbookId(
  guestbookRepository: GuestbookRepository,
  collectionId: number | string,
  guestbookId: number
): Promise<string> {
  return guestbookRepository.downloadGuestbookResponsesByGuestbookId(collectionId, guestbookId)
}
