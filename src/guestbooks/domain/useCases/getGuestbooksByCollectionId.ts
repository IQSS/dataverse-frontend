import { Guestbook } from '../models/Guestbook'
import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function getGuestbooksByCollectionId(
  guestbookRepository: GuestbookRepository,
  collectionIdOrAlias: number | string,
  includeStats?: boolean,
  includeInherited?: boolean
): Promise<Guestbook[]> {
  return guestbookRepository.getGuestbooksByCollectionId(
    collectionIdOrAlias,
    includeStats,
    includeInherited
  )
}
