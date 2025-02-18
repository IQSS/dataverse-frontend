import { Contact } from '../domain/models/Contact'
import { ContactRepository } from '../domain/repositories/ContactRepository'
import { ContactDTO } from '../domain/useCases/ContactDTO'
import { submitContactInfo } from '@iqss/dataverse-client-javascript'
import { getUser } from '@/users/domain/useCases/getUser'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { User } from '@/users/domain/models/User'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'

export class ContactJSDataverseRepository implements ContactRepository {
  async submitContactInfo(contactDTO: ContactDTO): Promise<Contact[]> {
    return submitContactInfo.execute(contactDTO).then((response: Contact[]) => response)
  }

  async getEmail(): Promise<string> {
    const userRepository = new UserJSDataverseRepository() as UserRepository
    const user: User | void = await getUser(userRepository)

    return user?.email || ''
  }

  async getCollectionName(collectionAlias: string): Promise<string> {
    const collectionRepository = new CollectionJSDataverseRepository()
    const collection = await collectionRepository.getById(collectionAlias)

    return collection?.name || ''
  }
}
