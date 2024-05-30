import { Button } from '@iqss/dataverse-design-system'
import { UserMother } from '../../users/domain/models/UserMother'
import { UserRepository } from '../../../../src/users/domain/repositories/UserRepository'
import { useSession } from '../../../../src/sections/session/SessionContext'
import { SessionProvider } from '../../../../src/sections/session/SessionProvider'

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository
describe('useSession', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
    userRepository.removeAuthenticated = cy.stub().resolves()
  })

  it('should set user after fetching from repository', () => {
    function TestComponent() {
      const { user } = useSession()

      return <div>{user ? <span>{user.displayName}</span> : <></>}</div>
    }

    cy.mount(
      <SessionProvider repository={userRepository}>
        <TestComponent />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')
    cy.findByText(testUser.displayName).should('exist')
  })

  it('should unset user after calling logOut on repository', () => {
    function TestComponent() {
      const { user, logout } = useSession()
      const onLogoutClick = () => {
        void logout()
      }

      return (
        <div>
          {user ? <span>{user.displayName}</span> : <></>}
          <Button onClick={onLogoutClick}>Log Out</Button>
        </div>
      )
    }

    cy.mount(
      <SessionProvider repository={userRepository}>
        <TestComponent />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByText(testUser.displayName).should('exist')

    cy.findByText('Log Out').click()

    cy.wrap(userRepository.removeAuthenticated).should('be.calledOnce')

    cy.findByText(testUser.displayName).should('not.exist')
  })
})
