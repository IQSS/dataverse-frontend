import { UserMother } from '../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../src/users/domain/repositories/UserRepository'
import { Header } from '../../../../../src/sections/layout/header/Header'
import { SessionProvider } from '../../../../../src/sections/session/SessionProvider'

const testUser = UserMother.create()
const userRepository: UserRepository = {} as UserRepository
describe('Header component', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
    userRepository.removeAuthenticated = cy.stub().resolves()
  })

  it('displays the brand', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header />
      </SessionProvider>
    )

    cy.findByRole('link', { name: /Dataverse/ }).should('exist')
    cy.findByRole('link').should('have.attr', 'href', '/spa/')
  })

  it('displays the user name when the user is logged in', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByText(testUser.name).should('be.visible')
    cy.findByText(testUser.name).click()
    cy.findByText('Log Out').should('be.visible')
  })

  it('displays the Sign Up and Log In links when the user is not logged in', () => {
    userRepository.getAuthenticated = cy.stub().resolves()

    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Sign Up' }).should('exist')
    cy.contains('Sign Up')
    cy.contains('Log In')
  })

  it('log outs the user after clicking Log Out', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()

    cy.findByText(testUser.name).click()

    cy.findByText('Log Out').click()

    cy.wrap(userRepository.removeAuthenticated).should('be.calledOnce')

    cy.findByText(testUser.name).should('not.exist')

    cy.findByText('Log In').should('exist')
    cy.findByText('Sign Up').should('exist')
  })
})
