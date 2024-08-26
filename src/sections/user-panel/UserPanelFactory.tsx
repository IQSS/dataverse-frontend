import { ReactElement } from 'react'
import { UserPanel } from './UserPanel'

export class UserPanelFactory {
  static create(): ReactElement {
    return <UserPanel />
  }
}
