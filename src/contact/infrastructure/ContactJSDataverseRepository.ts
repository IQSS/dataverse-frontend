import { submitContactInfo } from '@iqss/dataverse-client-javascript'
import { ContactResponse } from '../domain/models/ContactResponse'
import { ContactRepository } from '../domain/repositories/ContactRepository'
import { FeedbackDTO } from '../domain/useCases/DTOs/FeedbackDTO'
import { SpaFeedbackDTO } from '../domain/useCases/DTOs/SpaFeedbackDTO'

export class ContactJSDataverseRepository implements ContactRepository {
  async sendFeedbacktoOwners(feedbackDTO: FeedbackDTO): Promise<ContactResponse[]> {
    return submitContactInfo.execute(feedbackDTO).then((response: ContactResponse[]) => response)
  }
  // TODO: Remove this once we have a use case for sending SPA feedback to support
  async sendSpaFeedback(spaFeedbackDTO: SpaFeedbackDTO): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate a successful response
        resolve()
      }, 1_500)
    })
  }
}
