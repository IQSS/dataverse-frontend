import { useUser } from '../../../../../src/sections/layout/header/useUser'
import { UserMother } from '../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../src/users/domain/repositories/UserRepository'
import { Button } from 'dataverse-design-system'

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository
describe('useUser', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
    userRepository.removeAuthenticated = cy.stub().resolves()
  })

  it('should set user after fetching from repository', () => {
    function TestComponent() {
      const { user } = useUser(userRepository)

      return <div>{user ? <span>{user.name}</span> : <></>}</div>
    }

    cy.mount(<TestComponent />)

    cy.findByText(testUser.name).should('exist')
  })

  it('should unset user after calling logOut on repository', () => {
    function TestComponent() {
      const { user, submitLogOut } = useUser(userRepository)

      return (
        <div>
          {user ? <span>{user.name}</span> : <></>}
          <Button onClick={submitLogOut}>Log Out</Button>
        </div>
      )
    }

    cy.mount(<TestComponent />)

    cy.findByText(testUser.name).should('exist')

    cy.findByText('Log Out').click()

    cy.findByText(testUser.name).should('not.exist')
  })
})
