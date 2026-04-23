import { ReactElement } from 'react'
import { Header } from './Header'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { NotificationJSDataverseRepository } from '@/notifications/infrastructure/repositories/NotificationJSDataverseRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const notificationRepository = new NotificationJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()

export class HeaderFactory {
  static create(): ReactElement {
    return (
      <RepositoriesProvider
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}>
        <Header notficationRepository={notificationRepository} />
      </RepositoriesProvider>
    )
  }
}
