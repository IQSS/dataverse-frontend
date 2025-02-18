import { ContactRepository } from '../repositories/ContactRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'
import { ContactDTO } from './ContactDTO'
import { Contact } from '../models/Contact'

export async function submitContact(
  ContactRepository: ContactRepository,
  contactDTO: ContactDTO
): Promise<Contact[]> {
  return ContactRepository.submitContactInfo(contactDTO).catch((error: WriteError) => {
    throw new Error(error.message)
  })
}
