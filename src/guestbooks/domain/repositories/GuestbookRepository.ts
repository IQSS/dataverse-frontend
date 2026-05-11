import { Guestbook } from '../models/Guestbook'

export interface GuestbookRepository {
  getGuestbook: (guestbookId: number) => Promise<Guestbook>
  getGuestbooksByCollectionId: (collectionIdOrAlias: number | string) => Promise<Guestbook[]>
  assignDatasetGuestbook: (datasetId: number | string, guestbookId: number) => Promise<void>
  removeDatasetGuestbook: (datasetId: number | string) => Promise<void>
}
