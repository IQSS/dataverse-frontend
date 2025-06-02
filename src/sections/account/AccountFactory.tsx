import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AccountHelper } from './AccountHelper'
import { Account } from './Account'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'

const userRepository = new UserJSDataverseRepository()
const collectionRepository = new CollectionJSDataverseRepository()

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
      collectionRepository={collectionRepository}
    />
  )
}
