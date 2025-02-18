import { ContactRepository } from '../repositories/ContactRepository'
import { WriteError } from '@iqss/dataverse-client-javascript'

export async function getEmail(ContactRepository: ContactRepository): Promise<string> {
  return ContactRepository.getEmail().catch((error: WriteError) => {
    throw new Error(error.message)
  })
}
