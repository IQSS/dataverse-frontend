import { fireEvent, render } from '@testing-library/react'
import { SinonSandbox, createSandbox } from 'sinon'
import { Header } from '../../../../src/sections/layout/header/Header'
import { createAuthenticatedUser } from '../../../testHelpers/users/authenticatedUserHelper'
import { createGetCurrentAuthenticatedUser } from '../../../testHelpers/users/getCurrentAuthenticatedUserHelper'
import { createLogout } from '../../../testHelpers/auth/logoutHelper'

describe('Header component', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  test('displays the user name when the user is logged in', async () => {
    const testAuthenticatedUser = createAuthenticatedUser()
    const getCurrentAuthenticatedUserStub = createGetCurrentAuthenticatedUser()
    getCurrentAuthenticatedUserStub.execute = sandbox.stub().resolves(testAuthenticatedUser)
    const logoutMock = createLogout()
    const { findByText } = render(
      <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUserStub} logout={logoutMock} />
    )

    const userNameElement = await findByText('Test User')
    expect(userNameElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links when the user is not logged in', () => {
    const getCurrentAuthenticatedUserStub = createGetCurrentAuthenticatedUser()
    getCurrentAuthenticatedUserStub.execute = sandbox.stub().rejects({})
    const logoutMock = createLogout()
    const { getByRole } = render(
      <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUserStub} logout={logoutMock} />
    )

    const signUpLinkElement = getByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = getByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links after user Log Out', async () => {
    const testAuthenticatedUser = createAuthenticatedUser()
    const getCurrentAuthenticatedUserStub = createGetCurrentAuthenticatedUser()
    getCurrentAuthenticatedUserStub.execute = sandbox.stub().resolves(testAuthenticatedUser)
    const logoutStub = createLogout()
    logoutStub.execute = sandbox.stub().resolves({})
    const { findByText, findByRole } = render(
      <Header getCurrentAuthenticatedUser={getCurrentAuthenticatedUserStub} logout={logoutStub} />
    )

    const userNameElement = await findByText('Test User')
    fireEvent.click(userNameElement)

    const logOutLinkElement = await findByRole('button', { name: 'logOut' })
    fireEvent.click(logOutLinkElement)

    const signUpLinkElement = await findByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = await findByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })
})
