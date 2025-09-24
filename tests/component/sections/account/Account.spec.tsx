import { Account } from '../../../../src/sections/account/Account'
import { AccountHelper } from '../../../../src/sections/account/AccountHelper'
import { UserJSDataverseRepository } from '../../../../src/users/infrastructure/repositories/UserJSDataverseRepository'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { RoleMockRepository } from '@/stories/account/RoleMockRepository'
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
describe('Account', () => {
  it('should render the component', () => {
    cy.mountAuthenticated(
      <NotificationProvider repository={mockRepository}>
        <Account
          defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications}
          userRepository={new UserJSDataverseRepository()}
          collectionRepository={new CollectionMockRepository()}
          roleRepository={new RoleMockRepository()}
        />
      </NotificationProvider>
    )

    cy.get('h1').should('contain.text', 'Account')
    cy.findByRole('tab', { name: 'My Data' }).should('exist').and('be.enabled')
    cy.findByRole('tab', { name: 'Notifications' }).should('exist').and('be.disabled')
    cy.findByRole('tab', { name: 'Account Information' }).should('exist')
    cy.findByRole('tab', { name: 'API Token' }).should('be.enabled')
  })

  it('clicks on the Account Information tab', () => {
    cy.mountAuthenticated(
      <NotificationProvider repository={mockRepository}>
        <Account
          collectionRepository={new CollectionMockRepository()}
          defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications}
          userRepository={new UserJSDataverseRepository()}
          roleRepository={new RoleMockRepository()}
        />
      </NotificationProvider>
    )

    cy.findByRole('tab', { name: 'Account Information' }).click()
  })
})
