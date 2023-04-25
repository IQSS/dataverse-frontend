import { fireEvent, render } from '@testing-library/react'
import { SinonSandbox, createSandbox } from 'sinon'
import { Header } from '../../../../src/sections/layout/header/Header'
import { createTestUser } from '../../../testHelpers/users/userHelper'
import { UserRepository } from '../../../../src/domain/UserRepository'

describe('Header component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testUser = createTestUser()

  afterEach(() => {
    sandbox.restore()
  })

  test('displays the user name when the user is logged in', async () => {
    const userRepository: UserRepository = {} as UserRepository
    userRepository.getAuthenticated = sandbox.stub().resolves(testUser)

    const { findByText } = render(<Header userRepository={userRepository} />)

    const userNameElement = await findByText('Test User')
    expect(userNameElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links when the user is not logged in', () => {
    const userRepository: UserRepository = {} as UserRepository
    userRepository.getAuthenticated = sandbox.stub().resolves()

    const { getByRole } = render(<Header userRepository={userRepository} />)

    const signUpLinkElement = getByRole('link', { name: 'signUp' })
    expect(signUpLinkElement).toBeInTheDocument()

    const logInLinkElement = getByRole('link', { name: 'logIn' })
    expect(logInLinkElement).toBeInTheDocument()
  })

  test('displays the Sign Up and Log In links after user Log Out', async () => {
    const userRepository: UserRepository = {} as UserRepository
    userRepository.getAuthenticated = sandbox.stub().resolves(testUser)
    userRepository.removeAuthenticated = sandbox.stub().resolves()

    const { findByText, findByRole } = render(<Header userRepository={userRepository} />)

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
