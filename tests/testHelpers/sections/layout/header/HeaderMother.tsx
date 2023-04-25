import { SinonSandbox } from 'sinon'
import { ReactElement } from 'react'
import { Header } from '../../../../../src/sections/layout/header/Header'
import { UserMother } from '../../../users/UserMother'
import { UserRepository } from '../../../../../src/domain/UserRepository'
import { User } from '../../../../../src/domain/User'

export class HeaderMother {
  static withLoggedInUser(sandbox: SinonSandbox, user: User = UserMother.create()): ReactElement {
    const userRepository: UserRepository = {} as UserRepository
    userRepository.getAuthenticated = sandbox.stub().resolves(user)
    userRepository.removeAuthenticated = sandbox.stub().resolves()

    return <Header userRepository={userRepository} />
  }

  static withGuestUser(sandbox: SinonSandbox): ReactElement {
    const userRepository: UserRepository = {} as UserRepository
    userRepository.getAuthenticated = sandbox.stub().resolves()
    userRepository.removeAuthenticated = sandbox.stub().resolves()

    return <Header userRepository={userRepository} />
  }
}
