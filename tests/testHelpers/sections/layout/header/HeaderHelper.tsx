import { SinonSandbox } from 'sinon'
import { ReactElement } from 'react'
import { Header } from '../../../../../src/sections/layout/header/Header'
import { createGetCurrentAuthenticatedUser } from '../../../users/getCurrentAuthenticatedUserHelper'
import { createTestUser } from '../../../users/userHelper'

export class HeaderHelper {
  static createLoggedInUserHeader(sandbox: SinonSandbox): ReactElement {
    const getCurrentAuthenticatedUserStub = createGetCurrentAuthenticatedUser()
    getCurrentAuthenticatedUserStub.execute = sandbox.stub().resolves(createTestUser())
    return <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUserStub} />
  }

  static createGuestUserHeader(sandbox: SinonSandbox): ReactElement {
    const getCurrentAuthenticatedUserStub = createGetCurrentAuthenticatedUser()
    getCurrentAuthenticatedUserStub.execute = sandbox.stub().rejects({})
    return <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUserStub} />
  }
}
