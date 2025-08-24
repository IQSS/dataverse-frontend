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
  it('should translate ingestCompleted correctly', () => {
    const notif: Notification = {
      id: 1,
      type: NotificationType.INGEST_COMPLETED,
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false,
      datasetPersistentIdentifier: 'doi:123/abc',
      datasetDisplayName: 'Climate Data',
      userGuidesBaseUrl: 'https://guides.dataverse.org',
      userGuidesVersion: 'v5.12'
    }

    const result: string = getTranslatedNotification(notif, mockT)

    expect(result).contain('Climate Data')
    expect(result).contain('doi:123/abc')
    expect(result).contain('guides.dataverse.org/v5.12')
  })

  it('handles unknown notification types gracefully', () => {
    const notif: Notification = {
      id: 2,
      type: NotificationType.CREATE_DV, // Assuming this type is not in the map
      sentTimestamp: new Date().toISOString(),
      displayAsRead: false
    }

    const result = getTranslatedNotification(notif, mockT)
    console.log('result:', result)
    expect(result).contains('Unknown notification: CREATEDV')
  })
})
