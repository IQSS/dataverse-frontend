import { ReactElement } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { AccountHelper } from './AccountHelper'
import { Account } from './Account'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'

const userRepository = new UserJSDataverseRepository()

export class AccountFactory {
  static create(): ReactElement {
    return <AccountWithSearchParams />
  }
}

function AccountWithSearchParams() {
  const [searchParams] = useSearchParams()
  const defaultActiveTabKey = AccountHelper.defineSelectedTabKey(searchParams)
  const location = useLocation()
  const state = location.state as { accountCreated: boolean | undefined } | undefined
  const accountCreated = state?.accountCreated ?? false

  return (
    <Account
      defaultActiveTabKey={defaultActiveTabKey}
      userRepository={userRepository}
      accountCreated={accountCreated}
    />
  )
}
