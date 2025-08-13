import { submitContactInfo } from '@iqss/dataverse-client-javascript'
import { ContactResponse } from '../domain/models/ContactResponse'
import { ContactRepository } from '../domain/repositories/ContactRepository'
import { FeedbackDTO } from '../domain/useCases/FeedbackDTO'

export class ContactJSDataverseRepository implements ContactRepository {
  async sendFeedbacktoOwners(feedbackDTO: FeedbackDTO): Promise<ContactResponse[]> {
    return submitContactInfo.execute(feedbackDTO).then((response: ContactResponse[]) => response)
  }
}
