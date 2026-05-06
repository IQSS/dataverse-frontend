import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AccountHelper } from './AccountHelper'
import { Account } from './Account'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { RoleJSDataverseRepository } from '@/roles/infrastructure/repositories/RoleJSDataverseRepository'
import { NotificationJSDataverseRepository } from '@/notifications/infrastructure/repositories/NotificationJSDataverseRepository'

const userRepository = new UserJSDataverseRepository()
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
      userRepository={userRepository}
      roleRepository={roleRepository}
      notificationRepository={notificationRepository}
    />
  )
}
