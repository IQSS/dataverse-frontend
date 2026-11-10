import { GuestbookRepository } from '../repositories/GuestbookRepository'
import { GuestbookDTO } from './DTOs/GuestbookDTO'

export function createGuestbook(
  guestbookRepository: GuestbookRepository,
  collectionIdOrAlias: number | string,
  guestbook: GuestbookDTO
): Promise<number> {
  return guestbookRepository.createGuestbook(collectionIdOrAlias, guestbook)
}
