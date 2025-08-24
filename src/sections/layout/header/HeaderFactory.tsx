import { ReactElement } from 'react'
import { Header } from './Header'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { NotificationJSDataverseRepository } from '@/notifications/infrastructure/repositories/NotificationJSDataverseRepository'
const collectionRepository = new CollectionJSDataverseRepository()
const notificationRepository = new NotificationJSDataverseRepository()

export class HeaderFactory {
  static create(): ReactElement {
    return (
      <Header
        notificationRepository={notificationRepository}
        collectionRepository={collectionRepository}
      />
    )
  }
}
