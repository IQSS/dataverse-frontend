import { ReactElement } from 'react'
import { Account } from './Account'

export class AccountFactory {
  static create(): ReactElement {
    return <Account />
  }
}
