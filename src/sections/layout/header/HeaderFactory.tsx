import { ReactElement } from 'react'
import { Header } from './Header'
import { NotificationJSDataverseRepository } from '@/notifications/infrastructure/repositories/NotificationJSDataverseRepository'

const notificationRepository = new NotificationJSDataverseRepository()

export class HeaderFactory {
  static create(): ReactElement {
    return <Header notficationRepository={notificationRepository} />
  }
}
