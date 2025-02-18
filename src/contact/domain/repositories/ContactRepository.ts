import { ContactDTO } from '../useCases/ContactDTO'
import { Contact } from '../models/Contact'

export interface ContactRepository {
  submitContactInfo: (contactDTO: ContactDTO) => Promise<Contact[]>
  getEmail: () => Promise<string>
  getCollectionName: (collectionAlias: string) => Promise<string>
}
