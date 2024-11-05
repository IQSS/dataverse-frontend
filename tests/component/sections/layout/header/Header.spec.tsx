import { UserMother } from '../../../users/domain/models/UserMother'
import { UserRepository } from '../../../../../src/users/domain/repositories/UserRepository'
import { Header } from '../../../../../src/sections/layout/header/Header'
import { SessionProvider } from '../../../../../src/sections/session/SessionProvider'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'

const testUser = UserMother.create()
const rootCollection = CollectionMother.create({ id: 'root' })
const userRepository: UserRepository = {} as UserRepository
const collectionRepository: CollectionRepository = {} as CollectionRepository
describe('Header component', () => {
  beforeEach(() => {
    userRepository.getAuthenticated = cy.stub().resolves(testUser)
    userRepository.removeAuthenticated = cy.stub().resolves()
    collectionRepository.getById = cy.stub().resolves(rootCollection)
  })

  it('displays the brand', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header collectionRepository={collectionRepository} />
      </SessionProvider>
    )

    cy.findByRole('link', { name: /Dataverse/ }).should('exist')
    cy.findByRole('link').should('have.attr', 'href', '/spa/')
  })

  it('displays the user name when the user is logged in', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header collectionRepository={collectionRepository} />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByText(testUser.displayName).should('be.visible')
    cy.findByText(testUser.displayName).click()
    cy.findByText('Log Out').should('be.visible')
  })

  it('displays the Add Data Button when the user is logged in', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header collectionRepository={collectionRepository} />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    const addDataBtn = cy.findByRole('button', { name: /Add Data/i })
    addDataBtn.should('exist')
    addDataBtn.click()
    cy.findByRole('link', { name: 'New Collection' }).should('be.visible')
    cy.findByRole('link', { name: 'New Dataset' }).should('be.visible')
  })

  it('displays the Sign Up and Log In links when the user is not logged in', () => {
    userRepository.getAuthenticated = cy.stub().resolves()

    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header collectionRepository={collectionRepository} />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Sign Up' }).should('exist')
    cy.contains('Sign Up')
    cy.contains('Log In')
  })

  it('does not display the Add Data button when the user is not logged in', () => {
    userRepository.getAuthenticated = cy.stub().resolves()

    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header collectionRepository={collectionRepository} />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })

  it('log outs the user after clicking Log Out', () => {
    cy.customMount(
      <SessionProvider repository={userRepository}>
        <Header collectionRepository={collectionRepository} />
      </SessionProvider>
    )

    cy.wrap(userRepository.getAuthenticated).should('be.calledOnce')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()

    cy.findByText(testUser.displayName).click()

    cy.findByText('Log Out').click()

    cy.wrap(userRepository.removeAuthenticated).should('be.calledOnce')

    cy.findByText(testUser.displayName).should('not.exist')

    cy.findByText('Log In').should('exist')
    cy.findByText('Sign Up').should('exist')
  })
})
