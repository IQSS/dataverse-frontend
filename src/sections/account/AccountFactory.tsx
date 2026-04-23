import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AccountHelper } from './AccountHelper'
import { Account } from './Account'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { DatasetJSDataverseRepository } from '@/dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { RoleJSDataverseRepository } from '@/roles/infrastructure/repositories/RoleJSDataverseRepository'
import { NotificationJSDataverseRepository } from '@/notifications/infrastructure/repositories/NotificationJSDataverseRepository'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const userRepository = new UserJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const roleRepository = new RoleJSDataverseRepository()
const notificationRepository = new NotificationJSDataverseRepository()

export class AccountFactory {
  static create(): ReactElement {
    return <AccountWithSearchParams />
  }
}

function AccountWithSearchParams() {
  const [searchParams] = useSearchParams()
  const defaultActiveTabKey = AccountHelper.defineSelectedTabKey(searchParams)

  return (
    <RepositoriesProvider
      collectionRepository={collectionRepository}
      datasetRepository={datasetRepository}>
      <Account
        defaultActiveTabKey={defaultActiveTabKey}
        userRepository={userRepository}
        roleRepository={roleRepository}
        notificationRepository={notificationRepository}
      />
    </RepositoriesProvider>
  )
}
