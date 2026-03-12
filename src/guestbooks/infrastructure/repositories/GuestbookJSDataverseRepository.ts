import {
  assignDatasetGuestbook,
  getGuestbook,
  removeDatasetGuestbook
} from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '../../domain/repositories/GuestbookRepository'
import { Guestbook } from '../../domain/models/Guestbook'

export class GuestbookJSDataverseRepository implements GuestbookRepository {
  getGuestbook(guestbookId: number): Promise<Guestbook> {
    return getGuestbook.execute(guestbookId).then((guestbook) => guestbook as Guestbook)
  }

  assignDatasetGuestbook(datasetId: number | string, guestbookId: number): Promise<void> {
    return assignDatasetGuestbook.execute(datasetId, guestbookId)
  }

  removeDatasetGuestbook(datasetId: number | string): Promise<void> {
    return removeDatasetGuestbook.execute(datasetId)
  }
}
