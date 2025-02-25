import { FeedbackDTO } from '../useCases/FeedbackDTO'
import { Contact } from '../models/Contact'

export interface ContactRepository {
  sendFeedbacktoOwners: (feedbackDTO: FeedbackDTO) => Promise<Contact[]>
}
