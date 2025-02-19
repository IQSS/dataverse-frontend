import { ReactElement } from 'react'
import { ContactCollectionButton } from '@/sections/collection/contact-collection-button/ContactCollectionButton'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'

const contactRepository = new ContactJSDataverseRepository()

export class ContactFactory {
  static create(): ReactElement {
    return <ContactCollectionButton onSuccess={() => {}} collectionName="root" />
  }
}
