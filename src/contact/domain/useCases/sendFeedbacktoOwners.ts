import { ContactRepository } from '../repositories/ContactRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FeedbackDTO } from './DTOs/FeedbackDTO'
import { ContactResponse } from '../models/ContactResponse'

export async function sendFeedbacktoOwners(
  ContactRepository: ContactRepository,
  FeedbackDTO: FeedbackDTO
): Promise<ContactResponse[]> {
  return ContactRepository.sendFeedbacktoOwners(FeedbackDTO).catch((error: WriteError) => {
    throw new Error(error.message)
  })
}
