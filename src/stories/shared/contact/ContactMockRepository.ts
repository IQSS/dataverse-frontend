import { Contact } from '@/contact/domain/models/Contact'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/FeedbackDTO'

export class ContactMockRepository implements ContactRepository {
  sendFeedbacktoOwners(_feedbackDTO: FeedbackDTO): Promise<Contact[]> {
    return new Promise<Contact[]>((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1_000)
    })
  }
}
