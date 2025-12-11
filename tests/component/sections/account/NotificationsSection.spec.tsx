import { NotificationsSection } from '@/sections/account/notifications-section/NotificationsSection'
import { NotificationMother } from '@tests/component/notifications/domain/models/NotificationMother'
import { NotificationRepository } from '@/notifications/domain/repositories/NotificationRepository'
import { NotificationType } from '@/notifications/domain/models/Notification'

const notificationsRepository: NotificationRepository = {} as NotificationRepository

const createDatasetNotification = NotificationMother.create({
  datasetDisplayName: 'Climate Data',
  datasetPersistentIdentifier: 'doi:10.5072/FK2/CLIMATE',
  type: NotificationType.CREATE_DATASET,
  id: 1
})
const createDatasetNotificationSubset = {
  totalItemCount: 1,
  items: [createDatasetNotification]
}
const multipleNotificationSubset = {
  totalItemCount: 3,
  items: NotificationMother.createMany(2).concat([createDatasetNotification])
}
const paginationNotificationSubset = {
  totalItemCount: 25,
  items: NotificationMother.createMany(25)
}

const singleNotificationRepository = {
  getAllNotificationsByUser: () => Promise.resolve(createDatasetNotificationSubset),
  markNotificationAsRead: (_id: number) => Promise.resolve(),
  deleteNotification: (_id: number) => Promise.resolve(),
  getUnreadNotificationsCount: () => Promise.resolve(1)
}
const multipleNotificationRepository = {
  getAllNotificationsByUser: () => Promise.resolve(multipleNotificationSubset),
  markNotificationAsRead: (_id: number) => Promise.resolve(),
  deleteNotification: (_id: number) => Promise.resolve(),
  getUnreadNotificationsCount: () => Promise.resolve(1)
}
const mockRepository = {
  getAllNotificationsByUser: () => Promise.resolve(NotificationMother.createManyRealistic()),
  markNotificationAsRead: (_id: number) => Promise.resolve(),
  deleteNotification: (_id: number) => Promise.resolve(),
  getUnreadNotificationsCount: () => Promise.resolve(5)
}

const mockErrorRepository = {
  markNotificationAsRead: (_id: number) => Promise.resolve(),
  deleteNotification: (_id: number) => Promise.resolve(),
  getAllNotificationsByUser: () => Promise.reject(new Error('Failed to fetch')),
  getUnreadNotificationsCount: () => Promise.resolve(1)
}

describe('NotificationsSection', () => {
  it('renders notifications and handles dismiss', () => {
    cy.spy(singleNotificationRepository, 'deleteNotification').as('deleteNotification')
    cy.mountAuthenticated(
      <NotificationsSection notificationRepository={singleNotificationRepository} />
    )

    cy.contains('Climate Data was created').should('exist')
    cy.get('[data-testid="dismiss-notification-1"]').click()
    cy.get('@deleteNotification').should('have.been.calledOnceWith', 1)
  })
  it('shows loading and error states', () => {
    cy.mountAuthenticated(<NotificationsSection notificationRepository={mockErrorRepository} />)

    cy.contains('Failed to ').should('exist')
  })
  it('should mark notifications as read after delay', () => {
    cy.clock()
    cy.spy(singleNotificationRepository, 'markNotificationAsRead').as('markAsRead')
    cy.mountAuthenticated(
      <NotificationsSection notificationRepository={singleNotificationRepository} />
    )

    cy.contains('Climate Data was created').should('exist')

    cy.get('@markAsRead').should('not.have.been.called')

    cy.tick(2500)

    cy.get('@markAsRead').should('have.been.calledOnceWith', Cypress.sinon.match.number)
  })
})

describe('multiple notifications', () => {
  before(() => {
    notificationsRepository.getAllNotificationsByUser = cy.stub().resolves({
      totalItemCount: 3,
      items: [
        createDatasetNotification,
        NotificationMother.create({ id: 2 }),
        NotificationMother.create({ id: 3 })
      ]
    })
  })

  it('handles Clear All', () => {
    cy.spy(multipleNotificationRepository, 'deleteNotification').as('deleteNotification')

    cy.mountAuthenticated(
      <NotificationsSection notificationRepository={multipleNotificationRepository} />
    )

    cy.contains('Climate Data was created').should('exist')

    cy.findByRole('button', { name: 'Clear All' }).click()
    cy.get('@deleteNotification').should('have.been.calledThrice')
  })
})
