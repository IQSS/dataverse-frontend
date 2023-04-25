import { fireEvent, render } from '@testing-library/react'
import { SinonSandbox, createSandbox } from 'sinon'
import { createTestUser } from '../../../testHelpers/users/userHelper'
import { HeaderHelper } from '../../../testHelpers/sections/layout/header/HeaderHelper'

describe('Header component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testUser = createTestUser()

  afterEach(() => {
    sandbox.restore()
  })

  test('displays the user name when the user is logged in', async () => {
    const { findByText } = render(HeaderHelper.createWithLoggedInUser(sandbox))

    const userNameElement = await findByText(testUser.name)
    expect(userNameElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links when the user is not logged in', () => {
    const { getByRole } = render(HeaderHelper.createWithGuestUser(sandbox))

    const signUpLinkElement = getByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = getByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links after user Log Out', async () => {
    const { findByText, findByRole } = render(HeaderHelper.createWithLoggedInUser(sandbox))

    const userNameElement = await findByText(testUser.name)
    fireEvent.click(userNameElement)

    const logOutLinkElement = await findByRole('button', { name: 'logOut' })
    fireEvent.click(logOutLinkElement)

    const signUpLinkElement = await findByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = await findByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })
})
