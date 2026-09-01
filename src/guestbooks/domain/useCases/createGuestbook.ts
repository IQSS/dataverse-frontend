import { type CreateGuestbookDTO } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function createGuestbook(
  guestbookRepository: GuestbookRepository,
  collectionIdOrAlias: number | string,
  guestbook: CreateGuestbookDTO
): Promise<number> {
  return guestbookRepository.createGuestbook(collectionIdOrAlias, guestbook)
}
