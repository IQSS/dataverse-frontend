import { FeedbackDTO } from '../useCases/DTOs/FeedbackDTO'
import { ContactResponse } from '../models/ContactResponse'
import { SpaFeedbackDTO } from '../useCases/DTOs/SpaFeedbackDTO'

export interface ContactRepository {
  sendFeedbacktoOwners: (feedbackDTO: FeedbackDTO) => Promise<ContactResponse[]>
  sendSpaFeedback: (feedbackDTO: SpaFeedbackDTO) => Promise<void>
}
