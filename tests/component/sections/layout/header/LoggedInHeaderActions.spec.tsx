import { UserMother } from '../../../users/domain/models/UserMother'
import { LoggedInHeaderActions } from '../../../../../src/sections/layout/header/LoggedInHeaderActions'
import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../../collection/domain/models/CollectionMother'

const testUser = UserMother.create()
const collectionRepository: CollectionRepository = {} as CollectionRepository
const userPermissionsMock = CollectionMother.createUserPermissions()

describe('LoggedInHeaderActions', () => {
  it('shows New Collection button disabled if user has no permissions to create collection on Root', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(
      CollectionMother.createUserPermissions({
        canAddCollection: false
      })
    )

    cy.customMount(
      <LoggedInHeaderActions user={testUser} collectionRepository={collectionRepository} />
    )

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Collection' })
      .should('be.visible')
      .should('have.attr', 'aria-disabled', 'true')
  })

  it('shows New Collection button enabled if user has permissions to create collection on Root', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)

    cy.customMount(
      <LoggedInHeaderActions user={testUser} collectionRepository={collectionRepository} />
    )

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Collection' })
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'false')
  })

  it('shows New Dataset button disabled if user has no permissions to create dataset on Root', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(
      CollectionMother.createUserPermissions({
        canAddDataset: false
      })
    )

    cy.customMount(
      <LoggedInHeaderActions user={testUser} collectionRepository={collectionRepository} />
    )

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Dataset' })
      .should('be.visible')
      .should('have.attr', 'aria-disabled', 'true')
  })

  it('shows New Dataset button enabled if user has permissions to create dataset on Root', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)

    cy.customMount(
      <LoggedInHeaderActions user={testUser} collectionRepository={collectionRepository} />
    )

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Dataset' })
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'false')
  })

  it('shows both New Collection and New Dataset buttons enabled if user has permissions to create both on Root', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)

    cy.customMount(
      <LoggedInHeaderActions user={testUser} collectionRepository={collectionRepository} />
    )

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Collection' })
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'false')
    cy.findByRole('link', { name: 'New Dataset' })
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'false')
  })
})
