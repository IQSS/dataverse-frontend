import { Route, Routes } from 'react-router-dom'
import { AuthContext } from 'react-oauth2-code-pkce'
import { ReadError } from '@iqss/dataverse-client-javascript'
import { UserRepository } from '@/users/domain/repositories/UserRepository'
import { UserMother } from '@tests/component/users/domain/models/UserMother'
import { AuthContextMother } from '@tests/component/auth/AuthContextMother'
import {
  BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE,
  SessionProvider
} from '@/sections/session/SessionProvider'
import { useSession } from '@/sections/session/SessionContext'

const userRepository: UserRepository = {} as UserRepository
const testUser = UserMother.create()
const DELAYED_TIME = 200

describe('SessionProvider', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
  })

  const ComponentUsingContext = () => {
    const { user, isLoadingUser, refetchUserSession, sessionError } = useSession()

    return (
      <>
        {user && <p>{user.displayName}</p>}
        {isLoadingUser && <p>Loading...</p>}
        {sessionError && <p>{sessionError.message}</p>}
        <button onClick={refetchUserSession} type="button">
          Refetch User
        </button>
      </>
    )
  }

  const renderComponent = ({
    loginInProgress,
    withTokenPresent
  }: {
    loginInProgress: boolean
    withTokenPresent: boolean
  }) => {
    cy.customMount(
      <AuthContext.Provider
        value={{
          token: withTokenPresent ? AuthContextMother.createToken() : '',
          idToken: withTokenPresent ? AuthContextMother.createToken() : '',
          logIn: () => {},
          logOut: () => {},
          loginInProgress: loginInProgress,
          tokenData: withTokenPresent ? AuthContextMother.createTokenData() : undefined,
          idTokenData: withTokenPresent ? AuthContextMother.createTokenData() : undefined,
          error: null,
          login: () => {} // 👈 deprecated
        }}>
        <Routes>
          <Route element={<SessionProvider repository={userRepository} />}>
            <Route index element={<ComponentUsingContext />} />
            <Route path="sign-up" element={<div>Sign up</div>} />
          </Route>
        </Routes>
      </AuthContext.Provider>
    )
  }

  it('should fetch user when token is present and loginInProgress is false', () => {
    userRepository.getAuthenticated = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => testUser)
    })

    renderComponent({
      loginInProgress: false,
      withTokenPresent: true
    })

    cy.clock()

    cy.findByText('Loading...').should('exist')
    cy.findByText(testUser.displayName).should('not.exist')

    cy.tick(DELAYED_TIME)

    cy.findByText('Loading...').should('not.exist')
    cy.findByText(testUser.displayName).should('exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('should refetch user session when called and set user', () => {
    userRepository.getAuthenticated = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => testUser)
    })

    renderComponent({
      loginInProgress: false,
      withTokenPresent: false
    })

    cy.clock()

    cy.findByText(testUser.displayName).should('not.exist')

    cy.findByRole('button', { name: 'Refetch User' }).click()
    cy.findByText('Loading...').should('exist')

    cy.tick(DELAYED_TIME)

    cy.findByText('Loading...').should('not.exist')
    cy.findByText(testUser.displayName).should('exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('should detect BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE and redirect to sign up page', () => {
    userRepository.getAuthenticated = cy
      .stub()
      .rejects(new ReadError(`[403] ${BEARER_TOKEN_IS_VALID_BUT_NOT_LINKED_MESSAGE}`))

    renderComponent({
      loginInProgress: false,
      withTokenPresent: true
    })

    cy.findByText('Sign up').should('exist')
  })

  it('should detect any other ReadError instances', () => {
    userRepository.getAuthenticated = cy.stub().rejects(new ReadError())

    renderComponent({
      loginInProgress: false,
      withTokenPresent: true
    })

    cy.findByText('There was an error when reading the resource.').should('exist')
  })

  it('should show default error message when error is not a ReadError', () => {
    userRepository.getAuthenticated = cy.stub().rejects(new Error('Some error'))

    renderComponent({
      loginInProgress: false,
      withTokenPresent: true
    })

    cy.findByText('An unexpected error occurred while getting the user.').should('exist')
  })
})
