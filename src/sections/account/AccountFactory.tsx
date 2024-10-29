import { ReactElement } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AccountHelper } from './AccountHelper'
import { Account } from './Account'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'

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
      collectionRepository={collectionRepository}
      defaultActiveTabKey={defaultActiveTabKey}
    />
  )
}
