import { SinonSandbox } from 'sinon'
import { ReactElement } from 'react'
import { Header } from '../../../../../src/sections/layout/header/Header'
import { createTestUser } from '../../../users/userHelper'
import { UserRepository } from '../../../../../src/domain/UserRepository'

export class HeaderHelper {
  static createWithLoggedInUser(sandbox: SinonSandbox): ReactElement {
    const userRepository: UserRepository = {} as UserRepository
    userRepository.getAuthenticated = sandbox.stub().resolves(createTestUser())
    userRepository.removeAuthenticated = sandbox.stub().resolves()

    return <Header userRepository={userRepository} />
  }

  static createWithGuestUser(sandbox: SinonSandbox): ReactElement {
    const userRepository: UserRepository = {} as UserRepository
    userRepository.getAuthenticated = sandbox.stub().resolves()
    userRepository.removeAuthenticated = sandbox.stub().resolves()

    return <Header userRepository={userRepository} />
  }
}
