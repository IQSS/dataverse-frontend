import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'

export class ContactRepositoryFactory {
  static create(): ContactRepository {
    return new ContactJSDataverseRepository()
  }
}
