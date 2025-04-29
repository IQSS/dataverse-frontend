import { ContactResponse } from '@/contact/domain/models/ContactResponse'
import { FeedbackDTO } from '@/contact/domain/useCases/DTOs/FeedbackDTO'
import { SpaFeedbackDTO } from '@/contact/domain/useCases/DTOs/SpaFeedbackDTO'
import { ContactMockRepository } from './ContactMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class ContactMockErrorRepository implements ContactMockRepository {
  sendFeedbacktoOwners(_feedbackDTO: FeedbackDTO): Promise<ContactResponse[]> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }

  sendSpaFeedback(_feedbackDTO: SpaFeedbackDTO): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject()
      }, FakerHelper.loadingTimout())
    })
  }
}
