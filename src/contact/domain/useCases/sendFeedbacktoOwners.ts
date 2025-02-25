import { ContactRepository } from '../repositories/ContactRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { FeedbackDTO } from '../useCases/FeedbackDTO'
import { Contact } from '../models/Contact'

export async function sendFeedbacktoOwners(
  ContactRepository: ContactRepository,
  FeedbackDTO: FeedbackDTO
): Promise<Contact[]> {
  return ContactRepository.sendFeedbacktoOwners(FeedbackDTO).catch((error: WriteError) => {
    throw new Error(error.message)
  })
}
