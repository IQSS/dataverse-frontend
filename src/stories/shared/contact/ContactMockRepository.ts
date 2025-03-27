import { ContactResponse } from '@/contact/domain/models/ContactResponse'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/FeedbackDTO'

export class ContactMockRepository implements ContactRepository {
  sendFeedbacktoOwners(_feedbackDTO: FeedbackDTO): Promise<ContactResponse[]> {
    return new Promise<ContactResponse[]>((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1_000)
    })
  }
}
