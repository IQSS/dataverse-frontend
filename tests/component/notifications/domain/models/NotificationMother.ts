import { Notification } from '@/notifications/domain/models/Notification'
import { NotificationType } from '@/notifications/domain/models/Notification'

export class NotificationMother {
  static createManyRealistic(): Notification[] {
    return [
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
        displayAsRead: true,
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
    ]
  }
}
