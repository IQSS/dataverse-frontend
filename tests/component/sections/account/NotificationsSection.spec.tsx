import { NotificationsSection } from '@/sections/account/notifications-section/NotificationsSection'
import { NotificationMother } from '@tests/component/notifications/domain/models/NotificationMother'

const mockRepository = {
  getAllNotificationsByUser: () => Promise.resolve(NotificationMother.createManyRealistic()),
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
  it('should mark notifications as read after delay', () => {
    cy.clock()
    cy.spy(mockRepository, 'markNotificationAsRead').as('markAsRead')
    cy.mountAuthenticated(<NotificationsSection notificationRepository={mockRepository} />)

    cy.contains('Climate Data was created').should('exist')
    cy.contains('You have been granted the Curator role').should('exist')

    cy.get('@markAsRead').should('not.have.been.called')

    cy.tick(3000)

    cy.get('@markAsRead').should('have.been.calledOnceWith', Cypress.sinon.match.number)
  })
  it('renders notifications and handles dismiss', () => {
    cy.spy(mockRepository, 'deleteNotification').as('deleteNotification')
    cy.mountAuthenticated(<NotificationsSection notificationRepository={mockRepository} />)

    cy.contains('Climate Data was created').should('exist')
    cy.contains('You have been granted the Curator role').should('exist')
    cy.get('[data-testid="dismiss-notification-1"]').click()
    cy.get('@deleteNotification').should('have.been.calledOnceWith', 1)
  })
  it('handles Clear All', () => {
    cy.spy(mockRepository, 'deleteNotification').as('deleteNotification')
    cy.mountAuthenticated(<NotificationsSection notificationRepository={mockRepository} />)

    cy.contains('Climate Data was created').should('exist')
    cy.contains('You have been granted the Curator role').should('exist')

    cy.findByRole('button', { name: 'Clear All' }).click()
    cy.get('@deleteNotification').should('have.been.calledTwice')
  })

  it('shows loading and error states', () => {
    cy.mountAuthenticated(<NotificationsSection notificationRepository={mockErrorRepository} />)

    cy.contains('Failed to ').should('exist')
  })
})
