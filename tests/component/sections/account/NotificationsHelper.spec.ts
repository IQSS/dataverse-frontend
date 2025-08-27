import { Notification, NotificationType } from '@/notifications/domain/models/Notification'
import { getTranslatedNotification } from '@/sections/account/notifications-section/NotificationsHelper'
import { TFunction } from 'i18next'

import accountTranslations from '../../../../public/locales/en/account.json'

function getNestedValue(obj: unknown, path: string[]): unknown {
  return path.reduce((acc, key) => {
    if (typeof acc === 'object' && acc !== null && key in acc) {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj)
}

const mockT: TFunction = ((key: string) => {
  const path = key.split('.')
  const value = getNestedValue(accountTranslations, path)
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
    cy.customMount(getTranslatedNotification(notification, mockT))
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
    cy.customMount(getTranslatedNotification(notification, mockT))
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
    cy.customMount(getTranslatedNotification(notification, mockT))
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
    cy.customMount(getTranslatedNotification(notification, mockT))
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
    cy.customMount(getTranslatedNotification(notification, mockT))
    cy.findByText('Ocean Salinity Levels').should('exist')
    cy.contains('has been updated to Approved').should('exist')
    cy.findByRole('link', { name: 'Ocean Salinity Levels' }).should(
      'have.attr',
      'href',
      '/datasets?persistentId=doi:10.5678/osl.2024'
    )
  })
  it('handles unknown notification types gracefully', () => {
    const notification: Notification = {
      id: 2,
      type: NotificationType.ASSIGN_ROLE_COLLECTION, // Assuming this type is not in the map
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false
    }

    const result = getTranslatedNotification(notification, mockT)
    console.log('result:', result)
    expect(result).contains('Unknown notification: assignRoleCollection')
  })
})
