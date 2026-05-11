import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function assignDatasetGuestbook(
  guestbookRepository: GuestbookRepository,
  datasetId: string | number,
  guestbookId: number
): Promise<void> {
  return guestbookRepository.assignDatasetGuestbook(datasetId, guestbookId)
}
