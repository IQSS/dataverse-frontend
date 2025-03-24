import { FeedbackDTO } from '../useCases/FeedbackDTO'
import { ContactResponse } from '../models/ContactResponse'

export interface ContactRepository {
  sendFeedbacktoOwners: (feedbackDTO: FeedbackDTO) => Promise<ContactResponse[]>
}
