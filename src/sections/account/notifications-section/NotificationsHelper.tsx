import type { TFunction } from 'i18next'
import i18n from 'i18next'
import { Notification, NotificationType } from '@/notifications/domain/models/Notification'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { QueryParamKey, Route, RouteWithParams } from '@/sections/Route.enum'

const demoSiteUrl = 'https://demo.dataverse.org'
const NotificationTypeToTranslationMap: Record<NotificationType, string> = {
  [NotificationType.ASSIGN_ROLE]: 'assignRole',
  [NotificationType.REVOKE_ROLE]: 'revokeRole',
  [NotificationType.CREATE_COLLECTION]: 'createCollection',
  [NotificationType.CREATE_DATASET]: 'createDataset',
  [NotificationType.CREATE_ACC]: 'createAcc',
  [NotificationType.SUBMITTED_DS]: 'submittedDataset',
  [NotificationType.RETURNED_DS]: 'returnedDataset',
  [NotificationType.PUBLISHED_DS]: 'publishedDataset',
  [NotificationType.REQUEST_FILE_ACCESS]: 'requestFileAccess',
  [NotificationType.GRANT_FILE_ACCESS]: 'grantFileAccess',
  [NotificationType.REJECT_FILE_ACCESS]: 'rejectFileAccess',
  [NotificationType.FILE_SYSTEM_IMPORT]: 'fileSystemImport',
  [NotificationType.CHECKSUM_IMPORT]: 'checksumImport',
  [NotificationType.CHECKSUM_FAIL]: 'checksumFail',
  [NotificationType.CONFIRM_EMAIL]: 'confirmEmail',
  [NotificationType.API_GENERATED]: 'apiGenerated',
  [NotificationType.INGEST_COMPLETED]: 'ingestCompleted',
  [NotificationType.INGEST_COMPLETED_WITH_ERRORS]: 'ingestCompletedWithErrors',
  [NotificationType.PUBLISH_FAILED_PIDREG]: 'publishFailedPidReg',
  [NotificationType.WORKFLOW_SUCCESS]: 'workflowSuccess',
  [NotificationType.WORKFLOW_FAILURE]: 'workflowFailure',
  [NotificationType.STATUS_UPDATED]: 'statusUpdated',
  [NotificationType.DATASET_CREATED]: 'datasetCreated',
  [NotificationType.DATASET_MENTIONED]: 'datasetMentioned',
  [NotificationType.GLOBUS_UPLOAD_COMPLETED]: 'globusUploadCompleted',
  [NotificationType.GLOBUS_UPLOAD_COMPLETED_WITH_ERRORS]: 'globusUploadCompletedWithErrors',
  [NotificationType.GLOBUS_DOWNLOAD_COMPLETED]: 'globusDownloadCompleted',
  [NotificationType.GLOBUS_DOWNLOAD_COMPLETED_WITH_ERRORS]: 'globusDownloadCompletedWithErrors',
  [NotificationType.REQUESTED_FILE_ACCESS]: 'requestedFileAccess',
  [NotificationType.GLOBUS_UPLOAD_REMOTE_FAILURE]: 'globusUploadRemoteFailure',
  [NotificationType.GLOBUS_UPLOAD_LOCAL_FAILURE]: 'globusUploadLocalFailure',
  [NotificationType.PID_RECONCILED]: 'pidReconciled'
}

export function getTranslatedNotification(
  notification: Notification,
  t: TFunction = i18n.t.bind(i18n)
): JSX.Element {
  const key = NotificationTypeToTranslationMap[notification.type]
    ? `notifications.notification.${NotificationTypeToTranslationMap[notification.type]}`
    : `notifications.notification.unknown`
  const template = t(key)

  // If translation missing, return a fallback
  if (!template || template === key) {
    return <span>Unknown notification: {notification.type}</span>
  }
  if (notification.objectDeleted) {
    const deletedKey = 'notifications.notification.genericObjectDeleted'
    return <span>{t(deletedKey)}</span>
  }
  if (
    notification.type === NotificationType.ASSIGN_ROLE ||
    notification.type === NotificationType.REVOKE_ROLE
  ) {
    return translateRoleNotification(notification, key, t)
  }
  return translateGeneric(notification, key, t)
}

function translateRoleNotification(
  notification: Notification,
  key: string,
  t: TFunction
): JSX.Element {
  const roleNames = notification.roleAssignments
    ? notification.roleAssignments.map((ra) => ra.roleName).join(', ')
    : ''
  if (roleNames === 'File Downloader') {
    key = 'notifications.notification.assignRoleFileDownloader'
  }
  let objectLink: JSX.Element
  let objectName: string
  if (notification.collectionAlias && notification.collectionDisplayName) {
    objectName = notification.collectionDisplayName
    objectLink = <Link to={RouteWithParams.COLLECTIONS(notification.collectionAlias)} />
  } else if (notification.datasetDisplayName && notification.datasetPersistentIdentifier) {
    objectName = notification.datasetDisplayName
    objectLink = (
      <Link
        to={`${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${notification.datasetPersistentIdentifier}`}
      />
    )
  } else if (notification.dataFileDisplayName && notification.dataFileId) {
    objectName = notification.dataFileDisplayName
    objectLink = <Link to={`${Route.FILES}?${QueryParamKey.FILE_ID}=${notification.dataFileId}`} />
  } else {
    objectName = 'unknown object'
    objectLink = <></>
  }
  return (
    <Trans
      t={t}
      i18nKey={key}
      values={{
        objectName: objectName,
        roleName: roleNames
      }}
      components={{
        objectLink: objectLink
      }}
    />
  )
}

function translateGeneric(notification: Notification, key: string, t: TFunction): JSX.Element {
  const components: Record<string, JSX.Element> = {}
  const values: Record<string, string> = Object.fromEntries(
    Object.entries(notification).filter(
      ([_, value]) => typeof value === 'string' && value !== undefined
    )
  )

  // if additionalInfo contains @type, @id name and relationship fields, use the datasetMentioned translation,
  // otherwise use the generic additionalInfo field
  if (notification.additionalInfo) {
    const info = notification.additionalInfo
    const hasDatasetMentionedFields =
      typeof info === 'object' &&
      info['@type'] !== undefined &&
      info['name'] !== undefined &&
      info['relationship'] !== undefined

    if (hasDatasetMentionedFields) {
      key = 'notifications.notification.datasetMentioned'
      const id = info['@id'] as string
      values.name = info['name'] as string
      values.type = info['@type'] as string
      values.relationship = info['relationship'] as string
      components.relatedLink = <a href={`${id}`} target="_blank" rel="noopener noreferrer"></a>
    } else {
      key = 'notifications.notification.datasetMentionedGeneric'
      values.additionalInfo = JSON.stringify(info)
    }
  }
  if (notification.datasetPersistentIdentifier) {
    components.datasetLink = (
      <Link
        to={`${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${notification.datasetPersistentIdentifier}`}
      />
    )
  }
  if (notification.ownerAlias) {
    components.ownerLink = <Link to={RouteWithParams.COLLECTIONS(notification.ownerAlias)} />
  } else {
    components.ownerLink = <Link to={RouteWithParams.COLLECTIONS()} />
    values.ownerDisplayName = notification.installationBrandName || 'this installation'
  }
  if (notification.collectionAlias) {
    components.collectionLink = (
      <Link to={RouteWithParams.COLLECTIONS(notification.collectionAlias)} />
    )
  }
  if (notification.userGuidesBaseUrl && notification.userGuidesVersion) {
    components.userGuideLink = (
      <a
        href={`${notification.userGuidesBaseUrl}/en/${notification.userGuidesVersion}/${
          notification.userGuidesSectionPath || ''
        }`}
        target="_blank"
        rel="noopener noreferrer"></a>
    )
    values.userGuideLinkText = t('notifications.userGuideLinkText')
  }

  if (notification.type === NotificationType.CREATE_ACC) {
    components.demoLink = <a href={demoSiteUrl} target="_self" rel="noopener noreferrer"></a>
    values.demoServerLinkText = t('notifications.demoServerLinkText')
  }

  return <Trans t={t} i18nKey={key} values={values} components={components} />
}
