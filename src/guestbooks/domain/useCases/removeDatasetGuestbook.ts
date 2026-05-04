import { GuestbookRepository } from '../repositories/GuestbookRepository'

export function removeDatasetGuestbook(
  guestbookRepository: GuestbookRepository,
  datasetId: string | number
): Promise<void> {
  return guestbookRepository.removeDatasetGuestbook(datasetId)
}
