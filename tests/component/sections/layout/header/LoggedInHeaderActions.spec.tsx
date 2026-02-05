import { UserMother } from '../../../users/domain/models/UserMother'
import { LoggedInHeaderActions } from '../../../../../src/sections/layout/header/LoggedInHeaderActions'
import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../../collection/domain/models/CollectionMother'
import { DatasetRepository } from '../../../../../src/dataset/domain/repositories/DatasetRepository'
import { AuthContext } from 'react-oauth2-code-pkce'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'

const testUser = UserMother.create()
const collectionRepository: CollectionRepository = {} as CollectionRepository
const notificationRepository: NotificationRepository = {} as unknown as NotificationRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
const userPermissionsMock = CollectionMother.createUserPermissions()

describe('LoggedInHeaderActions', () => {
  beforeEach(() => {
    notificationRepository.getUnreadNotificationsCount = cy.stub().resolves(0)
  })
  it('shows New Collection button disabled if user has no permissions to create collection on Root', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(
      CollectionMother.createUserPermissions({
        canAddCollection: false
      })
    )
    collectionRepository.getById = cy.stub().resolves(CollectionMother.create())
    cy.customMount(
      <LoggedInHeaderActions
       
        user={testUser}
       
        collectionRepository={collectionRepository}
        notificationRepository={notificationRepository}
     
        datasetRepository={datasetRepository}
      />
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
      <LoggedInHeaderActions
       
        user={testUser}
       
        collectionRepository={collectionRepository}
        notificationRepository={notificationRepository}
     
        datasetRepository={datasetRepository}
      />
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
      <LoggedInHeaderActions
       
        user={testUser}
       
        collectionRepository={collectionRepository}
        notificationRepository={notificationRepository}
     
        datasetRepository={datasetRepository}
      />
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
      <LoggedInHeaderActions
       
        user={testUser}
       
        collectionRepository={collectionRepository}
        notificationRepository={notificationRepository}
     
        datasetRepository={datasetRepository}
      />
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
      <LoggedInHeaderActions
       
        user={testUser}
       
        collectionRepository={collectionRepository}
        notificationRepository={notificationRepository}
     
        datasetRepository={datasetRepository}
      />
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
  it('shows unread notification badge when there are unread notifications', () => {
    notificationRepository.getAllNotificationsByUser = cy.stub().resolves([
      { id: 1, message: 'Notification 1', isRead: false, createdAt: new Date().toISOString() },
      { id: 2, message: 'Notification 2', isRead: false, createdAt: new Date().toISOString() },
      { id: 3, message: 'Notification 3', isRead: false, createdAt: new Date().toISOString() }
    ])
    notificationRepository.getUnreadNotificationsCount = cy.stub().resolves(3)
    cy.mountAuthenticated(
      <LoggedInHeaderActions
        user={testUser}
        collectionRepository={collectionRepository}
        notificationRepository={notificationRepository}
      />
    )
    cy.findByRole('button', { name: /James D. Potts/i }).as('userBtn')
    cy.get('@userBtn').should('exist')
    cy.get('@userBtn').click()
    cy.get('[data-testid="unread-notifications-badge"]').should('exist').and('contain', '3')
    cy.get('[data-testid="unread-notifications-badge"]').should('have.length', 2)
  })

  it('calls the logout function when clicking the logout button', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)
    collectionRepository.getById = cy.stub().resolves(CollectionMother.create())

    cy.customMount(
      <AuthContext.Provider
        value={{
          token: 'fake-token-it-doesnt-matter-just-testing-logout-fn',
          idToken: undefined,
          logIn: () => {},
          logOut: cy.stub().as('logoutStub'),
          loginInProgress: false,
          tokenData: undefined,
          idTokenData: undefined,
          error: null,
          login: () => {}
        }}>
        <LoggedInHeaderActions
         
          user={testUser}
         
          collectionRepository={collectionRepository}
          notificationRepository={notificationRepository}
       
          datasetRepository={datasetRepository}
        />
      </AuthContext.Provider>
    )

    cy.get('#dropdown-user').should('exist').click()
    cy.findByTestId('oidc-logout').should('exist').click()
    cy.get('@logoutStub').should('have.been.calledOnce')
  })
})
