import { ContactResponse } from '@/contact/domain/models/ContactResponse'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { FeedbackDTO } from '@/contact/domain/useCases/DTOs/FeedbackDTO'
import { SpaFeedbackDTO } from '@/contact/domain/useCases/DTOs/SpaFeedbackDTO'

export class ContactMockRepository implements ContactRepository {
  sendFeedbacktoOwners(_feedbackDTO: FeedbackDTO): Promise<ContactResponse[]> {
    return new Promise<ContactResponse[]>((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1_000)
    })
  }

  sendSpaFeedback(_feedbackDTO: SpaFeedbackDTO): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1_000)
    })
  }
}
