import { Guestbook } from '../models/Guestbook'
import { GuestbookRepository } from '../repositories/GuestbookRepository'

export async function getGuestbook(
  guestbookRepository: GuestbookRepository,
  guestbookId: number
): Promise<Guestbook> {
  return guestbookRepository.getGuestbook(guestbookId)
}
