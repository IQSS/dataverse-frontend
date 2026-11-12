import { GuestbookResponseSubset } from '../models/GuestbookResponse'
import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function getGuestbookResponsesByGuestbookId(
  guestbookRepository: GuestbookRepository,
  guestbookId: number,
  limit?: number,
  offset?: number
): Promise<GuestbookResponseSubset> {
  return guestbookRepository.getGuestbookResponsesByGuestbookId(guestbookId, limit, offset)
}
