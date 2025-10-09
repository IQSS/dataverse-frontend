import { Notification, NotificationType } from '@/notifications/domain/models/Notification'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { TFunction } from 'i18next'

import accountTranslations from '../../../../public/locales/en/account.json'
const mockTranslations = {
  notifications: {
    notification: {
      assignRole:
        'You have been granted the {{roleName}} role for <objectLink>{{objectName}}</objectLink>.',
      assignRoleFileDownloader:
        'You now have access to all published restricted and unrestricted files in <objectLink>{{objectName}}</objectLink>.',
      revokeRole: 'You have been removed from a role in <objectLink>{{objectName}}</objectLink>.',
      createCollection:
        '<collectionLink>{{collectionDisplayName}}</collectionLink> was created in <ownerLink>{{ownerDisplayName}}</ownerLink> . '
    }
  }
}

function getNestedValue(obj: unknown, path: string[]): unknown {
  return path.reduce((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

const accountT: TFunction = ((key: string) => {
  const path = key.split('.')
  const value = getNestedValue(accountTranslations, path)
  return typeof value === 'string' ? value : key
}) as TFunction

const mockT: TFunction = ((key: string) => {
  const path = key.split('.')
  const value = getNestedValue(mockTranslations, path)
  return typeof value === 'string' ? value : key
}) as TFunction

describe('getTranslatedNotification', () => {
  it('should translate role assignment correctly', () => {
    const notification: Notification = {
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
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.findByText('Biodiversity Data').should('exist')
    cy.contains('You have been granted the Curator').should('exist')
    cy.findByRole('link', { name: 'Biodiversity Data' }).should(
      'have.attr',
      'href',
      '/collections/biodiversity'
    )
  })

  it('should display object deleted message when dataset is deleted', () => {
    const notification: Notification = {
      id: 5,
      type: NotificationType.PUBLISHED_DS,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Deleted Dataset',
      datasetPersistentIdentifier: 'doi:10.0000/deleted.2024',
      ownerDisplayName: 'Deleted Owner',
      ownerAlias: 'deleted_owner',
      objectDeleted: true
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('The dataverse, dataset, or file for this notification has been deleted.').should(
      'exist'
    )
    cy.findByRole('link', { name: 'Deleted Dataset' }).should('not.exist')
  })

  it('should translate status updated correctly', () => {
    const notification: Notification = {
      id: 4,
      type: NotificationType.STATUS_UPDATED,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Ocean Salinity Levels',
      datasetPersistentIdentifier: 'doi:10.5678/osl.2024',
      currentCurationStatus: 'Approved',
      ownerDisplayName: 'Alice Johnson',
      ownerAlias: 'alice_johnson'
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.findByText('Ocean Salinity Levels').should('exist')
    cy.contains('has been updated to Approved').should('exist')
    cy.findByRole('link', { name: 'Ocean Salinity Levels' }).should(
      'have.attr',
      'href',
      '/datasets?persistentId=doi:10.5678/osl.2024'
    )
  })

  it('should translate assignRoleFileDownloader correctly', () => {
    const notification: Notification = {
      id: 2,
      type: NotificationType.ASSIGN_ROLE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: "Darwins's Finches",
      datasetPersistentIdentifier: 'doi:10.3456/dataset.b',
      roleAssignments: [
        {
          id: 1,
          assignee: 'user123',
          definitionPointId: 101,
          roleId: 3,
          roleName: 'File Downloader',
          _roleAlias: 'fileDownloader'
        }
      ]
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains(
      "You now have access to all published restricted and unrestricted files in Darwins's Finches."
    ).should('exist')
  })
  it('should translate file role assignment with file display name and id', () => {
    const notification: Notification = {
      id: 14,
      type: NotificationType.ASSIGN_ROLE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      dataFileDisplayName: "Darwnins's Finches Data File - Sample File.csv",
      dataFileId: 12345,
      roleAssignments: [
        {
          id: 2,
          assignee: 'file_user',
          definitionPointId: 200,
          roleId: 4,
          roleName: 'File Editor',
          _roleAlias: 'fileEditor'
        }
      ]
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('Sample File.csv').should('exist')
    cy.contains('You have been granted the File Editor').should('exist')
    cy.findByRole('link', { name: "Darwnins's Finches Data File - Sample File.csv" }).should(
      'have.attr',
      'href',
      '/files?id=12345'
    )
  })

  it('should translate revokeRole correctly', () => {
    const notification: Notification = {
      id: 3,
      type: NotificationType.REVOKE_ROLE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Dataset C',
      datasetPersistentIdentifier: 'doi:10.9012/dataset.c',
      roleAssignments: [
        {
          id: 1,
          assignee: 'user123',
          definitionPointId: 101,
          roleId: 3,
          roleName: 'Editor',
          _roleAlias: 'editor'
        }
      ]
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('You have been removed from a role in Dataset C.').should('exist')
  })

  it('should translate createCollection correctly', () => {
    const notification: Notification = {
      id: 4,
      type: NotificationType.CREATE_COLLECTION,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      collectionDisplayName: 'Collection A',
      collectionAlias: 'collection_a',
      ownerDisplayName: 'User A',
      ownerAlias: 'user_a',
      userGuidesBaseUrl: 'https://guides.dataverse.org',
      userGuidesVersion: 'v5.12',
      userGuidesSectionPath: 'managing-collections'
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('Collection A was created in User A .').should('exist')
  })

  it('should translate unknown notification type correctly', () => {
    const notification: Notification = {
      id: 5,
      type: NotificationType.GLOBUS_UPLOAD_REMOTE_FAILURE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false
    }
    cy.customMount(getTranslatedNotification(notification, mockT))
    cy.contains('Unknown notification: globusUploadRemoteFailure').should('exist')
  })

  it('should translate published dataset correctly', () => {
    const notification: Notification = {
      id: 6,
      type: NotificationType.PUBLISHED_DS,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Dataset D',
      datasetPersistentIdentifier: 'doi:10.1234/dataset.d',
      ownerDisplayName: 'User B',
      ownerAlias: 'user_b'
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('Dataset D').should('exist')
    cy.contains('User B').should('exist')
    cy.findByRole('link', { name: 'Dataset D' }).should(
      'have.attr',
      'href',
      '/datasets?persistentId=doi:10.1234/dataset.d'
    )
  })

  it('should translate status updated correctly', () => {
    const notification: Notification = {
      id: 7,
      type: NotificationType.STATUS_UPDATED,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Dataset E',
      datasetPersistentIdentifier: 'doi:10.5678/dataset.e',
      currentCurationStatus: 'In Review',
      ownerDisplayName: 'User C'
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('Dataset E').should('exist')
    cy.contains('has been updated to In Review').should('exist')
    cy.findByRole('link', { name: 'Dataset E' }).should(
      'have.attr',
      'href',
      '/datasets?persistentId=doi:10.5678/dataset.e'
    )
  })
  it('should translate create account notification correctly', () => {
    const notification: Notification = {
      id: 13,
      type: NotificationType.CREATE_ACC,
      sentTimestamp: new Date().toISOString(),
      installationBrandName: 'Dataverse Installation',
      displayAsRead: false
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('Dataverse Installation').should('exist')
    cy.contains('Get started by adding or finding data.').should('exist')
  })

  it('should handle empty roleAssignments array', () => {
    const notification: Notification = {
      id: 9,
      type: NotificationType.ASSIGN_ROLE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      roleAssignments: []
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('You have been granted the').should('exist')
  })

  it('should handle unknown notification type with missing type', () => {
    const notification: Notification = {
      id: 11,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false
      // type is missing
    } as Notification
    cy.customMount(getTranslatedNotification(notification, mockT))
    cy.contains('Unknown notification').should('exist')
  })

  it('should handle notification with only id and sentTimestamp', () => {
    const notification: Notification = {
      id: 12,
      type: NotificationType.GLOBUS_UPLOAD_REMOTE_FAILURE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false
    }
    cy.customMount(getTranslatedNotification(notification, mockT))
    cy.contains('Unknown notification: globusUploadRemoteFailure').should('exist')
  })
  it('should handle create collection in owner with display name', () => {
    const notification: Notification = {
      id: 15,
      type: NotificationType.CREATE_COLLECTION,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      collectionDisplayName: 'Collection B',
      collectionAlias: 'collection_b',
      ownerDisplayName: 'Owner B',
      ownerAlias: 'owner_b',
      userGuidesBaseUrl: 'https://guides.dataverse.org',
      userGuidesVersion: 'v5.12',
      userGuidesSectionPath: 'managing-collections'
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('Collection B was created in Owner B .').should('exist')
    cy.findByRole('link', { name: 'Collection B' }).should(
      'have.attr',
      'href',
      '/collections/collection_b'
    )
    cy.findByRole('link', { name: 'Owner B' }).should('have.attr', 'href', '/collections/owner_b')
  })

  it('uses datasetMentioned translation when additionalInfo has required fields', () => {
    const notification: Notification = {
      type: NotificationType.DATASET_MENTIONED,
      id: 15,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Dataset With Mention',
      datasetPersistentIdentifier: 'doi:10.5678/dataset.e',
      additionalInfo: {
        '@type': 'Dataset',
        '@id': 'doi:10.1234/abcd',
        name: 'Test Dataset',
        relationship: 'mentioned'
      }
    }

    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('Announcement Received: Newly released').should('exist')
    cy.findByRole('link', { name: 'Test Dataset' }).should('exist')
  })

  it('uses datasetMentionedGeneric translation when additionalInfo is missing required fields', () => {
    const notification: Notification = {
      type: NotificationType.DATASET_MENTIONED,
      id: 15,
      sentTimestamp: new Date().toISOString(),
      datasetDisplayName: 'Dataset With Mention',
      datasetPersistentIdentifier: 'doi:10.5678/dataset.e',
      displayAsRead: false,
      additionalInfo: {
        field1: 'value1',
        field2: 'value2',
        '@id': 'doi:10.1234/abcd',
        name: 'Test Dataset',
        relationship: 'mentioned'
      }
    }

    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('value1').should('exist')
  })
})
