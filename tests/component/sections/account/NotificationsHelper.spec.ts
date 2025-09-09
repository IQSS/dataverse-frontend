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
  it('should translate createCollection correctly', () => {
    const notification: Notification = {
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
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.findByText('Climate Data').should('exist')
    cy.findByText('Jane Doe').should('exist')
    cy.findByRole('link', { name: 'Climate Data' }).should(
      'have.attr',
      'href',
      '/collections/climate'
    )
  })
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

  it('should translate published dataset correctly', () => {
    const notification: Notification = {
      id: 3,
      type: NotificationType.PUBLISHED_DS,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Global Warming Trends',
      datasetPersistentIdentifier: 'doi:10.1234/gwt.2024',
      ownerDisplayName: 'John Smith Collection',
      ownerAlias: 'john_smith'
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.findByText('Global Warming Trends').should('exist')
    cy.findByText('John Smith Collection').should('exist')
    cy.findByRole('link', { name: 'Global Warming Trends' }).should(
      'have.attr',
      'href',
      '/datasets?persistentId=doi:10.1234/gwt.2024'
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
  it('should translate assignRole correctly', () => {
    const notification: Notification = {
      id: 1,
      type: NotificationType.ASSIGN_ROLE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Dataset A',
      roleAssignments: [
        {
          id: 1,
          assignee: 'user123',
          definitionPointId: 101,
          roleId: 3,
          roleName: 'Editor',
          _roleAlias: 'editor'
        }
      ],
      datasetPersistentIdentifier: 'doi:10.9012/dataset.a'
    }
    cy.customMount(getTranslatedNotification(notification, accountT))
    cy.contains('You have been granted the Editor role for Dataset A.').should('exist')
  })

  it('should translate assignRoleFileDownloader correctly', () => {
    const notification: Notification = {
      id: 2,
      type: NotificationType.ASSIGN_ROLE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Dataset B',
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
      'You now have access to all published restricted and unrestricted files in Dataset B.'
    ).should('exist')
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
    cy.contains('Collection A was created in User A.').should('exist')
  })

  it('should translate globusUploadRemoteFailure correctly', () => {
    const notification: Notification = {
      id: 5,
      type: NotificationType.GLOBUS_UPLOAD_REMOTE_FAILURE,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false
    }
    const result = getTranslatedNotification(notification, mockT)
    expect(result).to.contain('Unknown notification: globusUploadRemoteFailure')
  })

  it('should translate published dataset correctly', () => {
    const notification: Notification = {
      id: 6,
      type: NotificationType.PUBLISHED_DS,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetDisplayName: 'Dataset D',
      datasetPersistentIdentifier: 'doi:10.1234/dataset.d',
      ownerDisplayName: 'User B'
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
  it('handles unknown notification types gracefully', () => {
    const notification: Notification = {
      id: 2,
      type: NotificationType.GLOBUS_UPLOAD_REMOTE_FAILURE, // Assuming this type is not in the map
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false
    }

    const result = getTranslatedNotification(notification, mockT)
    console.log('result:', result)
    expect(result).contains('Unknown notification: globusUploadRemoteFailure')
  })
})
