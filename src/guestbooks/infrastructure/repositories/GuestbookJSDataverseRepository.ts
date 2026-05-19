import {
  assignDatasetGuestbook,
  createGuestbook,
  downloadGuestbookResponsesByDataverseId,
  downloadGuestbookResponsesOfAGuestbook,
  type CreateGuestbookDTO,
  getGuestbooksByCollectionId,
  getGuestbook,
  setGuestbookEnabled,
  removeDatasetGuestbook
} from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '../../domain/repositories/GuestbookRepository'
import { Guestbook } from '../../domain/models/Guestbook'

export class GuestbookJSDataverseRepository implements GuestbookRepository {
  createGuestbook(
    collectionIdOrAlias: number | string,
    guestbook: CreateGuestbookDTO
  ): Promise<number> {
    return createGuestbook.execute(guestbook, collectionIdOrAlias)
  }

  getGuestbook(guestbookId: number): Promise<Guestbook> {
    return getGuestbook.execute(guestbookId).then((guestbook) => guestbook as Guestbook)
  }

  getGuestbooksByCollectionId(collectionIdOrAlias: number | string): Promise<Guestbook[]> {
    return getGuestbooksByCollectionId
      .execute(collectionIdOrAlias)
      .then((guestbooks) => guestbooks as Guestbook[])
  }

  setGuestbookEnabled(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void> {
    return setGuestbookEnabled.execute(collectionIdOrAlias, guestbookId, enabled)
  }

  downloadGuestbookResponsesByDataverseId(dataverseId: number | string): Promise<string> {
    return downloadGuestbookResponsesByDataverseId.execute(dataverseId)
  }

  downloadGuestbookResponsesOfAGuestbook(
    dataverseId: number | string,
    guestbookId: number
  ): Promise<string> {
    return downloadGuestbookResponsesOfAGuestbook.execute(dataverseId, guestbookId)
  }

  assignDatasetGuestbook(datasetId: number | string, guestbookId: number): Promise<void> {
    return assignDatasetGuestbook.execute(datasetId, guestbookId)
  }

  removeDatasetGuestbook(datasetId: number | string): Promise<void> {
    return removeDatasetGuestbook.execute(datasetId)
  }
}
