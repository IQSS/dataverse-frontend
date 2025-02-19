import { Contact } from '../domain/models/Contact'
import { ContactRepository } from '../domain/repositories/ContactRepository'
import { ContactDTO } from '../domain/useCases/ContactDTO'
import { submitContactInfo } from '@iqss/dataverse-client-javascript'

export class ContactJSDataverseRepository implements ContactRepository {
  async submitContactInfo(contactDTO: ContactDTO): Promise<Contact[]> {
    return submitContactInfo.execute(contactDTO).then((response: Contact[]) => response)
  }
}
