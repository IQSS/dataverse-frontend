import { ReactElement } from 'react'
import { Header } from './Header'
import { UserJsDataverseRepository } from '../../../infrastructure/UserJsDataverseRepository'

const userRepository = new UserJsDataverseRepository()

export class HeaderFactory {
  static create(): ReactElement {
    return <Header userRepository={userRepository} />
  }
}
