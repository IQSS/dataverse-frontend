import type { TFunction } from 'i18next'
import i18n from 'i18next'
import { Notification, NotificationType } from '@/notifications/domain/models/Notification'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import { QueryParamKey, Route, RouteWithParams } from '@/sections/Route.enum'

function formatString(template: string, values: (string | undefined)[]): string {
  return template.replace(/{(\d+)}/g, (match, index) => {
    const value = values[Number(index)]
    return value !== undefined ? value : match
  })
}
type TranslatedNotification = string | JSX.Element

export function getTranslatedNotification(
  notification: Notification,
  t: TFunction = i18n.t.bind(i18n)
): TranslatedNotification {
  const key = `notifications.notification.${notification.type}`
  const template = t(key)

  // If translation missing, return a fallback
  if (!template || template === key) {
    return `Unknown notification: ${notification.type}`
  }
  if (notification.objectDeleted) {
    const deletedKey = 'notifications.notification.genericObjectDeleted'
    return t(deletedKey)
  }
  switch (notification.type) {
    case NotificationType.CREATE_COLLECTION:
      return translateCreateCollection(notification, key, t)
    case NotificationType.ASSIGN_ROLE:
    case NotificationType.REVOKE_ROLE:
      return translateWithRoles(notification, key, t)
    case NotificationType.PUBLISHED_DS:
    case NotificationType.PUBLISH_FAILED_PIDREG:
    case NotificationType.RETURNED_DS:
    case NotificationType.WORKFLOW_FAILURE:
    case NotificationType.WORKFLOW_SUCCESS:
    case NotificationType.PID_RECONCILED:
    case NotificationType.FILE_SYSTEM_IMPORT:
    case NotificationType.CHECKSUM_IMPORT:
    case NotificationType.GLOBUS_UPLOAD_COMPLETED:
    case NotificationType.GLOBUS_DOWNLOAD_COMPLETED:
    case NotificationType.GLOBUS_UPLOAD_COMPLETED_WITH_ERRORS:
    case NotificationType.GLOBUS_UPLOAD_REMOTE_FAILURE:
    case NotificationType.GLOBUS_UPLOAD_LOCAL_FAILURE:
    case NotificationType.GLOBUS_DOWNLOAD_COMPLETED_WITH_ERRORS:
    case NotificationType.CHECKSUM_FAIL:
      return translateWithDatasetLink(notification, key, t)
    case NotificationType.STATUS_UPDATED:
      return translateWithDatasetLink(notification, key, t, true)
    default: {
      return template
    }
  }
}
type RequiredField = keyof Notification

function requireNotificationFields<K extends RequiredField>(
  notification: Notification,
  ...fields: K[]
): Notification & Record<K, string> {
  for (const field of fields) {
    const value = notification[field]
    if (typeof value !== 'string' || value.trim() === '') {
      throw new Error(`Missing required field: ${field}`)
    }
  }

  return notification as Notification & Record<K, string>
}

export function translateCreateCollection(
  notification: Notification,
  key: string,
  t: TFunction
): JSX.Element {
  const {
    collectionDisplayName,
    collectionAlias,
    ownerDisplayName,
    ownerAlias,
    userGuidesBaseUrl,
    userGuidesVersion
  } = requireNotificationFields(
    notification,
    'collectionDisplayName',
    'collectionAlias',
    'ownerDisplayName',
    'ownerAlias',
    'userGuidesBaseUrl',
    'userGuidesVersion'
  )
  return (
    <Trans
      t={t}
      i18nKey={key}
      values={{
        collectionDisplayName: collectionDisplayName,
        ownerDisplayName: ownerDisplayName
      }}
      components={{
        collectionLink: <Link to={RouteWithParams.COLLECTIONS(collectionAlias)} />,
        ownerLink: <Link to={RouteWithParams.COLLECTIONS(ownerAlias)} />,
        userGuideLink: (
          <a
            href={`${userGuidesBaseUrl}/${userGuidesVersion}/user/your-guide-section.html`}
            target="_blank"
            rel="noopener noreferrer"
          />
        )
      }}
    />
  )
}
export function translateWithRoles(
  notification: Notification,
  key: string,
  t: TFunction
): JSX.Element {
  if (!notification.roleAssignments) {
    throw new Error(`Missing required field: roleAssignments`)
  }

  const roleNames = notification.roleAssignments.map((ra) => ra.roleName).join(', ')
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
    throw new Error('Missing required field for role notification message.')
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

export function translateWithDatasetLink(
  notification: Notification,
  key: string,
  t: TFunction,
  includeCurationStatus = false
): JSX.Element {
  const { datasetDisplayName, datasetPersistentIdentifier, ownerDisplayName, ownerAlias } =
    requireNotificationFields(
      notification,
      'datasetDisplayName',
      'datasetPersistentIdentifier',
      'ownerDisplayName',
      'ownerAlias'
    )
  const values = {
    datasetDisplayName: datasetDisplayName,
    ownerDisplayName: ownerDisplayName
  }
  if (includeCurationStatus) {
    const { currentCurationStatus } = requireNotificationFields(
      notification,
      'currentCurationStatus'
    )
    Object.assign(values, { currentCurationStatus })
  }
  return (
    <Trans
      t={t}
      i18nKey={key}
      values={values}
      components={{
        datasetLink: (
          <Link
            to={`${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${datasetPersistentIdentifier}`}
          />
        ),
        ownerLink: <Link to={RouteWithParams.COLLECTIONS(ownerAlias)} />
      }}
    />
  )
}
