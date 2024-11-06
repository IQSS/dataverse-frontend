import { ReactElement } from 'react'
import { ApiTokenSection } from './ApiTokenSection'
import { UserJSDataverseRepository } from '@/users/infrastructure/repositories/UserJSDataverseRepository'

const userRepository = new UserJSDataverseRepository()

export class createUserRepository {
  static create(): ReactElement {
    return <CreateUserRepository />
  }
}

function CreateUserRepository() {
  return <ApiTokenSection repository={userRepository} />
}
