import { ReactElement } from 'react'
import { Header } from './Header'
import { UserJSDataverseRepository } from '../../../users/infrastructure/repositories/UserJSDataverseRepository'

const userRepository = new UserJSDataverseRepository()

export class HeaderFactory {
  static create(): ReactElement {
    return <Header userRepository={userRepository} />
  }
}
