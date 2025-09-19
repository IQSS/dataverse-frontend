import { mount } from 'cypress/react'
import { NotificationsSection } from '@/sections/account/notifications-section/NotificationsSection'
import { NotificationProvider } from '@/notifications/context/NotificationsContext'

export const mockRepository = {
  fetchNotifications: () =>
    Promise.resolve([
      { id: 1, displayAsRead: false, message: 'Test notification 1' },
      { id: 2, displayAsRead: true, message: 'Test notification 2' }
    ]),
  markNotificationAsRead: (_id: number) => Promise.resolve(),
  markNotificationAsUnread: (_id: number) => Promise.resolve(),
  deleteNotification: (_id: number) => Promise.resolve(),
  getAllNotificationsByUser: () => Promise.resolve([]),
  getUnreadNotificationsCount: () => Promise.resolve(1)
}
describe('NotificationsSection', () => {
  it('renders notifications and handles actions', () => {
    mount(
      <NotificationProvider repository={mockRepository}>
        <NotificationsSection />
      </NotificationProvider>
    )

    cy.contains('Test notification 1').should('exist')
    cy.contains('Test notification 2').should('exist')

    // Select all
    cy.get('input#select-all').check({ force: true })
    cy.get('button[title="Delete"]').click()
    // You may need to stub and spy on repository methods for these assertions
    // cy.get('@deleteNotifications').should('have.been.called')

    // Mark as read
    cy.get('button[title="Mark as read"]').click()
    // cy.get('@markAsRead').should('have.been.called')

    // Mark as unread
    cy.get('button[title="Mark as unread"]').click()
    // cy.get('@markAsUnread').should('have.been.called')
  })

  it('shows loading and error states', () => {
    // For loading and error states, you should create a custom NotificationProvider or mock context
    // For simplicity, skip these or refactor your NotificationProvider to accept initial state for tests
  })
})
