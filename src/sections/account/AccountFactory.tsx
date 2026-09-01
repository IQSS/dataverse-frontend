import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AccountHelper } from './AccountHelper'
import { Account } from './Account'
import { RoleJSDataverseRepository } from '@/roles/infrastructure/repositories/RoleJSDataverseRepository'
import { NotificationJSDataverseRepository } from '@/notifications/infrastructure/repositories/NotificationJSDataverseRepository'

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
    <Account
      defaultActiveTabKey={defaultActiveTabKey}
      roleRepository={roleRepository}
      notificationRepository={notificationRepository}
    />
  )
}
