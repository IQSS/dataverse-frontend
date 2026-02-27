import { Guestbook } from '../models/Guestbook'

export interface GuestbookRepository {
  getGuestbook: (guestbookId: number) => Promise<Guestbook>
}
