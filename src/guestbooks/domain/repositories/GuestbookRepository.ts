import { GuestbookDTO } from '../useCases/DTOs/GuestbookDTO'
import { Guestbook } from '../models/Guestbook'
import { GuestbookResponseSubset } from '../models/GuestbookResponse'

export interface GuestbookRepository {
  createGuestbook: (
    collectionIdOrAlias: number | string,
    guestbook: GuestbookDTO
  ) => Promise<number>
  editGuestbook: (guestbookId: number, guestbook: GuestbookDTO) => Promise<void>
  getGuestbook: (guestbookId: number) => Promise<Guestbook>
  getGuestbooksByCollectionId: (
    collectionIdOrAlias: number | string,
    includeStats?: boolean,
    includeInherited?: boolean
  ) => Promise<Guestbook[]>
  getGuestbookResponsesByGuestbookId: (
    guestbookId: number,
    limit?: number,
    offset?: number
  ) => Promise<GuestbookResponseSubset>
  setGuestbookEnabled: (
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ) => Promise<void>
  downloadGuestbookResponsesByCollectionId: (collectionId: number | string) => Promise<string>
  downloadGuestbookResponsesByGuestbookId: (
    collectionId: number | string,
    guestbookId: number
  ) => Promise<string>
  assignDatasetGuestbook: (datasetId: number | string, guestbookId: number) => Promise<void>
  removeDatasetGuestbook: (datasetId: number | string) => Promise<void>
}
