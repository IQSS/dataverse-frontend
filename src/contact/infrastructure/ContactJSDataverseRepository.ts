import { submitContactInfo } from '@iqss/dataverse-client-javascript'
import { Contact } from '../domain/models/Contact'
import { ContactRepository } from '../domain/repositories/ContactRepository'
import { FeedbackDTO } from '../domain/useCases/FeedbackDTO'

export class ContactJSDataverseRepository implements ContactRepository {
  async sendFeedbacktoOwners(feedbackDTO: FeedbackDTO): Promise<Contact[]> {
    return submitContactInfo.execute(feedbackDTO).then((response: Contact[]) => response)
  }
}
