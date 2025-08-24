import i18n from 'i18next'
import type { TFunction } from 'i18next'
import { Notification } from '@/notifications/domain/models/Notification'

const notificationParamMap: Record<string, (keyof Notification | string)[]> = {
  ingestCompleted: [
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'userGuidesBaseUrl',
    'userGuidesVersion'
  ],
  ingestCompletedWithErrors: [
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'userGuidesBaseUrl',
    'userGuidesVersion'
  ],
  genericObjectDeleted: [],
  accessGrantedDataverse: ['roleAssignments', 'dataverseDisplayName'],
  accessGrantedDataset: ['roleAssignments', 'datasetDisplayName'],
  accessGrantedDatafile: ['roleAssignments', 'datasetDisplayName'],
  accessGrantedFileDownloaderAdditionalDataverse: ['additionalInfo'],
  accessGrantedFileDownloaderAdditionalDataset: ['additionalInfo'],
  accessRevokedDataverse: ['dataverseDisplayName'],
  accessRevokedDataset: ['datasetDisplayName'],
  accessRevokedDatafile: ['datasetDisplayName'],
  checksumFail: ['datasetPersistentIdentifier', 'datasetDisplayName'],
  ingestCompletedWithErrorsDetailed: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'userGuidesBaseUrl',
    'userGuidesVersion',
    'additionalInfo'
  ],
  mailImportFilesystem: ['userGuidesBaseUrl', 'datasetPersistentIdentifier', 'datasetDisplayName'],
  mailGlobusUploadCompleted: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  mailGlobusDownloadCompleted: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  mailGlobusUploadCompletedWithErrors: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  mailGlobusUploadFailedRemotely: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  mailGlobusUploadFailedLocally: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  mailGlobusDownloadCompletedWithErrors: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  importFilesystem: ['datasetPersistentIdentifier', 'datasetDisplayName'],
  globusUploadCompleted: ['datasetPersistentIdentifier', 'datasetDisplayName'],
  globusDownloadCompleted: ['datasetPersistentIdentifier', 'datasetDisplayName'],
  globusUploadCompletedWithErrors: ['datasetPersistentIdentifier', 'datasetDisplayName'],
  globusUploadFailedRemotely: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  globusUploadFailedLocally: [
    'userGuidesBaseUrl',
    'datasetPersistentIdentifier',
    'datasetDisplayName',
    'additionalInfo'
  ],
  globusDownloadCompletedWithErrors: ['datasetPersistentIdentifier', 'datasetDisplayName'],
  importChecksum: ['datasetPersistentIdentifier', 'datasetDisplayName']
}

function formatString(template: string, values: (string | undefined)[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    const value = values[Number(index)]
    return value !== undefined ? value : match
  })
}

export function getTranslatedNotification(
  notification: Notification,
  t: TFunction = i18n.t.bind(i18n)
): string {
  const key = `notifications.notification.${notification.type}`
  const template = t(key)

  // If translation missing, return a fallback
  if (!template || template === key) {
    return `Unknown notification: ${notification.type}`
  }

  const paramKeys = notificationParamMap[notification.type] || []
  const values = paramKeys.map((k) =>
    k === 'roleAssignments'
      ? notification.roleAssignments?.[0]?.roleName
      : notification[k as keyof Notification]?.toString()
  )

  return formatString(template, values)
}
