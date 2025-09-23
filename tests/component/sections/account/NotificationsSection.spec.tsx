import { NotificationsSection } from '@/sections/account/notifications-section/NotificationsSection'
import { NotificationProvider } from '@/notifications/context/NotificationsContext'
import { NotificationType } from '@/notifications/domain/models/Notification'

const mockRepository = {
  getAllNotificationsByUser: () =>
    Promise.resolve([
      {
        id: 1,
        type: NotificationType.CREATE_COLLECTION,
        sentTimestamp: new Date().toISOString(),
        displayAsRead: false,
        collectionDisplayName: 'Climate Data',
        collectionAlias: 'climate',
        ownerDisplayName: 'Jane Doe',
        ownerAlias: 'jane_doe',
        userGuidesBaseUrl: 'https://guides.dataverse.org',
        userGuidesVersion: 'v5.12'
      },
      {
        id: 2,
        type: NotificationType.ASSIGN_ROLE,
        sentTimestamp: new Date().toISOString(),
        displayAsRead: false,
        collectionDisplayName: 'Biodiversity Data',
        collectionAlias: 'biodiversity',
        roleAssignments: [
          {
            id: 1,
            assignee: 'alice_user',
            definitionPointId: 100,
            roleId: 2,
            roleName: 'Curator',
            _roleAlias: 'curator'
          }
        ],
        ownerDisplayName: 'Alice Smith',
        ownerAlias: 'alice_smith'
      }
    ]),
  markNotificationAsRead: (_id: number) => Promise.resolve(),
  deleteNotification: (_id: number) => Promise.resolve(),
  getUnreadNotificationsCount: () => Promise.resolve(1)
}
const mockErrorRepository = {
  markNotificationAsRead: (_id: number) => Promise.resolve(),
  deleteNotification: (_id: number) => Promise.resolve(),
  getAllNotificationsByUser: () => Promise.reject(new Error('Failed to fetch')),
  getUnreadNotificationsCount: () => Promise.resolve(1)
}
describe('NotificationsSection', () => {
  it('renders notifications and handles dismiss', () => {
    cy.spy(mockRepository, 'markNotificationAsRead').as('markNotificationAsRead')
    cy.mountAuthenticated(
      <NotificationProvider repository={mockRepository}>
        <NotificationsSection />
      </NotificationProvider>
    )

    cy.contains('Climate Data was created').should('exist')
    cy.contains('You have been granted the Curator role').should('exist')
    cy.get('[data-testid="dismiss-notification-1"]').click()
    cy.get('@markNotificationAsRead').should('have.been.calledOnceWith', 1)
  })
  it('handles Clear All', () => {
    cy.spy(mockRepository, 'markNotificationAsRead').as('markNotificationAsRead')
    cy.mountAuthenticated(
      <NotificationProvider repository={mockRepository}>
        <NotificationsSection />
      </NotificationProvider>
    )

    cy.contains('Climate Data was created').should('exist')
    cy.contains('You have been granted the Curator role').should('exist')

    cy.findByRole('button', { name: 'Clear All' }).click()
    cy.get('@markNotificationAsRead').should('have.been.calledTwice')
  })

  it('shows loading and error states', () => {
    cy.mountAuthenticated(
      <NotificationProvider repository={mockErrorRepository}>
        <NotificationsSection />
      </NotificationProvider>
    )

    cy.contains('Failed to ').should('exist')
  })
})
