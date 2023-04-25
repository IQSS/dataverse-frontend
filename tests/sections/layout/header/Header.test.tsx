import { fireEvent, render } from '@testing-library/react'
import { SinonSandbox, createSandbox } from 'sinon'
import { UserMother } from '../../../users/domain/models/UserMother'
import { HeaderMother } from './HeaderMother'

describe('Header component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testUser = UserMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  test('displays the user name when the user is logged in', async () => {
    const { findByText } = render(HeaderMother.withLoggedInUser(sandbox, testUser))

    const userNameElement = await findByText(testUser.name)
    expect(userNameElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links when the user is not logged in', () => {
    const { getByRole } = render(HeaderMother.withGuestUser(sandbox))

    const signUpLinkElement = getByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = getByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links after user Log Out', async () => {
    const { findByText, findByRole } = render(HeaderMother.withLoggedInUser(sandbox, testUser))

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
