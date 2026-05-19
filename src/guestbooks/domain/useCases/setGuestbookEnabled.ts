import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function setGuestbookEnabled(
  guestbookRepository: GuestbookRepository,
  collectionIdOrAlias: number | string,
  guestbookId: number,
  enabled: boolean
): Promise<void> {
  return guestbookRepository.setGuestbookEnabled(collectionIdOrAlias, guestbookId, enabled)
}
