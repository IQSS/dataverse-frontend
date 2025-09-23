import { UserMother } from '../../../users/domain/models/UserMother'
import { Header } from '../../../../../src/sections/layout/header/Header'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { NotificationProvider } from '@/notifications/context/NotificationsContext'

const testUser = UserMother.create()
const rootCollection = CollectionMother.create({ id: 'root' })
const collectionRepository: CollectionRepository = {} as CollectionRepository
const notificationRepository: NotificationRepository = {} as unknown as NotificationRepository

describe('Header component', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(rootCollection)
    notificationRepository.getUnreadNotificationsCount = cy.stub().resolves(0)
  })
  it('displays the brand', () => {
    cy.mountAuthenticated(
      <NotificationProvider repository={notificationRepository}>
        <Header collectionRepository={collectionRepository} />
      </NotificationProvider>
    )

    cy.findByRole('link', { name: /Dataverse/ }).should('exist')
    cy.findByRole('link').should('have.attr', 'href', '/spa/')
  })

  it('displays the user name when the user is logged in', () => {
    cy.mountAuthenticated(
      <NotificationProvider repository={notificationRepository}>
        <Header collectionRepository={collectionRepository} />
      </NotificationProvider>
    )
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByText(testUser.displayName).should('be.visible')
    cy.findByText(testUser.displayName).click()
    cy.findByText('Log Out').should('be.visible')
  })

  it('displays the Add Data Button when the user is logged in', () => {
    cy.mountAuthenticated(
      <NotificationProvider repository={notificationRepository}>
        <Header collectionRepository={collectionRepository} />
      </NotificationProvider>
    )

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    const addDataBtn = cy.findByRole('button', { name: /Add Data/i })
    addDataBtn.should('exist')
    addDataBtn.click()
    cy.findByRole('link', { name: 'New Collection' }).should('be.visible')
    cy.findByRole('link', { name: 'New Dataset' }).should('be.visible')
  })

  it('displays the Log In button when the user is not logged in', () => {
    cy.customMount(
      <NotificationProvider repository={notificationRepository}>
        <Header collectionRepository={collectionRepository} />
      </NotificationProvider>
    )
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('button', { name: 'Log In' }).should('exist')
  })

  it('does not display the Add Data button when the user is not logged in', () => {
    cy.customMount(
      <NotificationProvider repository={notificationRepository}>
        <Header collectionRepository={collectionRepository} />
      </NotificationProvider>
    )
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })
  it('Displays the unread notifications badge', () => {
    notificationRepository.getAllNotificationsByUser = cy.stub().resolves([
      { id: 1, message: 'Notification 1', isRead: false, createdAt: new Date().toISOString() },
      { id: 2, message: 'Notification 2', isRead: false, createdAt: new Date().toISOString() },
      { id: 3, message: 'Notification 3', isRead: false, createdAt: new Date().toISOString() }
    ])
    cy.mountAuthenticated(
      <NotificationProvider repository={notificationRepository}>
        <Header collectionRepository={collectionRepository} />
      </NotificationProvider>
    )
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.get('[data-testid="unread-notifications-badge"]').should('exist').and('contain', '3')
  })
})
