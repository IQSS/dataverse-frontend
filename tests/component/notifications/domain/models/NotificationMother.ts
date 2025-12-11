import { Notification, NotificationType } from '@/notifications/domain/models/Notification'
import { faker } from '@faker-js/faker'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

export class NotificationMother {
  static create(props?: Partial<Notification>): Notification {
    return {
      id: faker.datatype.number({ min: 1 }),
      type: faker.helpers.arrayElement([
        NotificationType.CREATE_COLLECTION,
        NotificationType.ASSIGN_ROLE,
        NotificationType.REVOKE_ROLE,
        NotificationType.PUBLISHED_DS,
        NotificationType.CREATE_DATASET
      ]),
      sentTimestamp: new Date().toISOString(),
      displayAsRead: faker.datatype.boolean(),
      datasetDisplayName: faker.lorem.words(3),
      datasetPersistentIdentifier: `doi:10.5072/FK2/${faker.random.alphaNumeric(8).toUpperCase()}`,
      roleAssignments: [
        {
          id: faker.datatype.number({ min: 1 }),
          assignee: faker.internet.userName(),
          definitionPointId: faker.datatype.number({ min: 1 }),
          roleId: faker.datatype.number({ min: 1 }),
          roleName: faker.helpers.arrayElement(['Admin', 'Curator', 'Contributor', 'FileUploader']),
          _roleAlias: faker.helpers.arrayElement([
            'admin',
            'curator',
            'contributor',
            'fileuploader'
          ])
        }
      ],
      collectionDisplayName: FakerHelper.collectionName(),
      collectionAlias: faker.lorem.word(),
      ownerDisplayName: faker.name.fullName(),
      ownerAlias: faker.internet.userName(),
      userGuidesBaseUrl: 'https://guides.dataverse.org',
      userGuidesVersion: 'v5.12',
      ...props
    }
  }
  static createMany(amount: number, props?: Partial<Notification>): Notification[] {
    return Array.from({ length: amount }).map(() =>
      this.create({
        ...props
      })
    )
  }
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
