import { render } from '@testing-library/react'
import { SinonSandbox, createSandbox } from 'sinon'
import { Header } from '../../../../src/sections/layout/header/Header'
import { createAuthenticatedUser } from '../../../testHelpers/users/authenticatedUserHelper'
import { createGetCurrentAuthenticatedUser } from '../../../testHelpers/users/getCurrentAuthenticatedUserHelper'
import { createLogout } from '../../../testHelpers/auth/logoutHelper'

describe('Header component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const logoutMock = createLogout()

  afterEach(() => {
    sandbox.restore()
  })

  test('displays the user name when the user is logged in', async () => {
    const testAuthenticatedUser = createAuthenticatedUser()
    const getCurrentAuthenticatedUserStub = createGetCurrentAuthenticatedUser()
    getCurrentAuthenticatedUserStub.execute = sandbox.stub().resolves(testAuthenticatedUser)
    const { findByText } = render(
      <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUserStub} logout={logoutMock} />
    )

    const userNameElement = await findByText('Test User')
    expect(userNameElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links when the user is not logged in', () => {
    const getCurrentAuthenticatedUserStub = createGetCurrentAuthenticatedUser()
    getCurrentAuthenticatedUserStub.execute = sandbox.stub().rejects({})
    const { getByRole } = render(
      <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUserStub} logout={logoutMock} />
    )

    const signUpLinkElement = getByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = getByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })
})
