import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function downloadGuestbookResponsesByCollectionId(
  guestbookRepository: GuestbookRepository,
  collectionId: number | string
): Promise<string> {
  return guestbookRepository.downloadGuestbookResponsesByCollectionId(collectionId)
}
