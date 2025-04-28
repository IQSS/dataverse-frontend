import { ContactRepository } from '../repositories/ContactRepository'
import { SpaFeedbackDTO } from './DTOs/SpaFeedbackDTO'

export async function sendSpaFeedback(
  ContactRepository: ContactRepository,
  spaFeedbackDTO: SpaFeedbackDTO
): Promise<void> {
  return ContactRepository.sendSpaFeedback(spaFeedbackDTO)
}
