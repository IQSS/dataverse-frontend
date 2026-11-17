import { GuestbookRepository } from '../repositories/GuestbookRepository'
import { GuestbookDTO } from './DTOs/GuestbookDTO'

export function editGuestbook(
  guestbookRepository: GuestbookRepository,
  guestbookId: number,
  guestbook: GuestbookDTO
): Promise<void> {
  return guestbookRepository.editGuestbook(guestbookId, guestbook)
}
