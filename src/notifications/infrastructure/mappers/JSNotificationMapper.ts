import {
  NotificationType as JSNotificationType,
  Notification as JSNotification
} from '@iqss/dataverse-client-javascript'

import { NotificationType } from '@/notifications/domain/models/Notification'
import { Notification } from '@/notifications/domain/models/Notification'
export class JSNotificationMapper {
  private static readonly jsToNotificationTypeMap: Record<JSNotificationType, NotificationType> = {
    [JSNotificationType.ASSIGNROLE]: NotificationType.ASSIGN_ROLE,
    [JSNotificationType.REVOKEROLE]: NotificationType.REVOKE_ROLE,
    [JSNotificationType.CREATEDV]: NotificationType.CREATE_COLLECTION,
    [JSNotificationType.CREATEDS]: NotificationType.CREATE_DATASET,
    [JSNotificationType.CREATEACC]: NotificationType.CREATE_ACC,
    [JSNotificationType.SUBMITTEDDS]: NotificationType.SUBMITTED_DS,
    [JSNotificationType.RETURNEDDS]: NotificationType.RETURNED_DS,
    [JSNotificationType.PUBLISHEDDS]: NotificationType.PUBLISHED_DS,
    [JSNotificationType.REQUESTFILEACCESS]: NotificationType.REQUEST_FILE_ACCESS,
    [JSNotificationType.GRANTFILEACCESS]: NotificationType.GRANT_FILE_ACCESS,
    [JSNotificationType.REJECTFILEACCESS]: NotificationType.REJECT_FILE_ACCESS,
    [JSNotificationType.FILESYSTEMIMPORT]: NotificationType.FILE_SYSTEM_IMPORT,
    [JSNotificationType.CHECKSUMIMPORT]: NotificationType.CHECKSUM_IMPORT,
    [JSNotificationType.CHECKSUMFAIL]: NotificationType.CHECKSUM_FAIL,
    [JSNotificationType.CONFIRMEMAIL]: NotificationType.CONFIRM_EMAIL,
    [JSNotificationType.APIGENERATED]: NotificationType.API_GENERATED,
    [JSNotificationType.INGESTCOMPLETED]: NotificationType.INGEST_COMPLETED,
    [JSNotificationType.INGESTCOMPLETEDWITHERRORS]: NotificationType.INGEST_COMPLETED_WITH_ERRORS,
    [JSNotificationType.PUBLISHFAILED_PIDREG]: NotificationType.PUBLISH_FAILED_PIDREG,
    [JSNotificationType.WORKFLOW_SUCCESS]: NotificationType.WORKFLOW_SUCCESS,
    [JSNotificationType.WORKFLOW_FAILURE]: NotificationType.WORKFLOW_FAILURE,
    [JSNotificationType.STATUSUPDATED]: NotificationType.STATUS_UPDATED,
    [JSNotificationType.DATASETCREATED]: NotificationType.DATASET_CREATED,
    [JSNotificationType.DATASETMENTIONED]: NotificationType.DATASET_MENTIONED,
    [JSNotificationType.GLOBUSUPLOADCOMPLETED]: NotificationType.GLOBUS_UPLOAD_COMPLETED,
    [JSNotificationType.GLOBUSUPLOADCOMPLETEDWITHERRORS]:
      NotificationType.GLOBUS_UPLOAD_COMPLETED_WITH_ERRORS,
    [JSNotificationType.GLOBUSDOWNLOADCOMPLETED]: NotificationType.GLOBUS_DOWNLOAD_COMPLETED,
    [JSNotificationType.GLOBUSDOWNLOADCOMPLETEDWITHERRORS]:
      NotificationType.GLOBUS_DOWNLOAD_COMPLETED_WITH_ERRORS,
    [JSNotificationType.REQUESTEDFILEACCESS]: NotificationType.REQUESTED_FILE_ACCESS,
    [JSNotificationType.GLOBUSUPLOADREMOTEFAILURE]: NotificationType.GLOBUS_UPLOAD_REMOTE_FAILURE,
    [JSNotificationType.GLOBUSUPLOADLOCALFAILURE]: NotificationType.GLOBUS_UPLOAD_LOCAL_FAILURE,
    [JSNotificationType.PIDRECONCILED]: NotificationType.PID_RECONCILED
  }

  toNotificationType(jsNotificationType: JSNotificationType): NotificationType {
    return JSNotificationMapper.jsToNotificationTypeMap[jsNotificationType]
  }
  toNotification(jsNotification: JSNotification): Notification {
    return {
      id: jsNotification.id,
      type: this.toNotificationType(jsNotification.type),
      subjectText: jsNotification.subjectText,
      messageText: jsNotification.messageText,
      sentTimestamp: jsNotification.sentTimestamp,
      displayAsRead: jsNotification.displayAsRead,
      installationBrandName: jsNotification.installationBrandName,
      userGuidesBaseUrl: jsNotification.userGuidesBaseUrl,
      userGuidesVersion: jsNotification.userGuidesVersion,
      userGuidesSectionPath: jsNotification.userGuidesSectionPath,
      roleAssignments: jsNotification.roleAssignments,
      collectionAlias: jsNotification.collectionAlias,
      collectionDisplayName: jsNotification.collectionDisplayName,
      ownerAlias: jsNotification.ownerAlias,
      ownerDisplayName: jsNotification.ownerDisplayName,
      datasetPersistentIdentifier: jsNotification.datasetPersistentIdentifier,
      datasetDisplayName: jsNotification.datasetDisplayName,
      dataFileId: jsNotification.dataFileId,
      dataFileDisplayName: jsNotification.dataFileDisplayName,
      objectDeleted: jsNotification.objectDeleted ?? false
    }
  }
}
