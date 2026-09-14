import {
  assignDatasetGuestbook,
  createGuestbook,
  downloadGuestbookResponsesByCollectionId,
  downloadGuestbookResponsesOfAGuestbook as downloadGuestbookResponsesByGuestbookId,
  type CreateGuestbookDTO,
  getGuestbooksByCollectionId,
  getGuestbook,
  getGuestbookResponsesByGuestbookId,
  setGuestbookEnabled,
  removeDatasetGuestbook
} from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '../../domain/repositories/GuestbookRepository'
import { Guestbook } from '../../domain/models/Guestbook'
import { GuestbookResponseSubset } from '../../domain/models/GuestbookResponse'

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

  getGuestbooksByCollectionId(
    collectionIdOrAlias: number | string,
    includeStats = false,
    includeInherited = false
  ): Promise<Guestbook[]> {
    return getGuestbooksByCollectionId
      .execute(collectionIdOrAlias, includeStats, includeInherited)
      .then((guestbooks) => guestbooks as Guestbook[])
  }

  getGuestbookResponsesByGuestbookId(
    guestbookId: number,
    limit?: number,
    offset?: number
  ): Promise<GuestbookResponseSubset> {
    return getGuestbookResponsesByGuestbookId
      .execute(guestbookId, limit, offset)
      .then((subset) => ({
        ...subset,
        guestbookResponses: subset.guestbookResponses.map(({ name, ...response }) => ({
          ...response,
          userName: name
        }))
      }))
  }

  setGuestbookEnabled(
    collectionIdOrAlias: number | string,
    guestbookId: number,
    enabled: boolean
  ): Promise<void> {
    return setGuestbookEnabled.execute(collectionIdOrAlias, guestbookId, enabled)
  }

  downloadGuestbookResponsesByCollectionId(collectionId: number | string): Promise<string> {
    return downloadGuestbookResponsesByCollectionId.execute(collectionId)
  }

  downloadGuestbookResponsesByGuestbookId(
    collectionId: number | string,
    guestbookId: number
  ): Promise<string> {
    return downloadGuestbookResponsesByGuestbookId.execute(collectionId, guestbookId)
  }

  assignDatasetGuestbook(datasetId: number | string, guestbookId: number): Promise<void> {
    return assignDatasetGuestbook.execute(datasetId, guestbookId)
  }

  removeDatasetGuestbook(datasetId: number | string): Promise<void> {
    return removeDatasetGuestbook.execute(datasetId)
  }
}
