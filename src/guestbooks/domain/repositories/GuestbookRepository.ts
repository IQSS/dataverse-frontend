import { type CreateGuestbookDTO } from '@iqss/dataverse-client-javascript'
import { Guestbook } from '../models/Guestbook'

export interface GuestbookRepository {
  createGuestbook: (
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ) => Promise<number>
  getGuestbook: (guestbookId: number) => Promise<Guestbook>
  getGuestbooksByCollectionId: (collectionIdOrAlias: number | string) => Promise<Guestbook[]>
  assignDatasetGuestbook: (datasetId: number | string, guestbookId: number) => Promise<void>
  removeDatasetGuestbook: (datasetId: number | string) => Promise<void>
}
