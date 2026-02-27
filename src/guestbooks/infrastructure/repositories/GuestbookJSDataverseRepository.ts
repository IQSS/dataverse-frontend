import { getGuestbook } from '@iqss/dataverse-client-javascript'
import { GuestbookRepository } from '../../domain/repositories/GuestbookRepository'
import { Guestbook } from '../../domain/models/Guestbook'

export class GuestbookJSDataverseRepository implements GuestbookRepository {
  async getGuestbook(guestbookId: number): Promise<Guestbook> {
    return (await getGuestbook.execute(guestbookId)) as Guestbook
  }
}
