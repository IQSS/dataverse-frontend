export enum NotificationType {
  ASSIGN_ROLE = 'ASSIGNROLE',
  REVOKE_ROLE = 'REVOKEROLE',
  CREATE_DV = 'CREATEDV',
  CREATE_DS = 'CREATEDS',
  CREATE_ACC = 'CREATEACC',
  SUBMITTED_DS = 'SUBMITTEDDS',
  RETURNED_DS = 'RETURNEDDS',
  PUBLISHED_DS = 'PUBLISHEDDS',
  REQUEST_FILE_ACCESS = 'REQUESTFILEACCESS',
  GRANT_FILE_ACCESS = 'GRANTFILEACCESS',
  REJECT_FILE_ACCESS = 'REJECTFILEACCESS',
  FILE_SYSTEM_IMPORT = 'FILESYSTEMIMPORT',
  CHECKSUM_IMPORT = 'CHECKSUMIMPORT',
  CHECKSUM_FAIL = 'CHECKSUMFAIL',
  CONFIRM_EMAIL = 'CONFIRMEMAIL',
  API_GENERATED = 'APIGENERATED',
  INGEST_COMPLETED = 'ingestCompleted',
  INGEST_COMPLETED_WITH_ERRORS = 'INGESTCOMPLETEDWITHERRORS',
  PUBLISH_FAILED_PIDREG = 'PUBLISHFAILED_PIDREG',
  WORKFLOW_SUCCESS = 'WORKFLOW_SUCCESS',
  WORKFLOW_FAILURE = 'WORKFLOW_FAILURE',
  STATUS_UPDATED = 'STATUSUPDATED',
  DATASET_CREATED = 'DATASETCREATED',
  DATASET_MENTIONED = 'DATASETMENTIONED',
  GLOBUS_UPLOAD_COMPLETED = 'GLOBUSUPLOADCOMPLETED',
  GLOBUS_UPLOAD_COMPLETED_WITHERRORS = 'GLOBUSUPLOADCOMPLETEDWITHERRORS',
  GLOBUS_DOWNLOAD_COMPLETED = 'GLOBUSDOWNLOADCOMPLETED',
  GLOBUS_DOWNLOAD_COMPLETED_WITH_ERRORS = 'GLOBUSDOWNLOADCOMPLETEDWITHERRORS',
  REQUESTED_FILE_ACCESS = 'REQUESTEDFILEACCESS',
  GLOBUS_UPLOAD_REMOTE_FAILURE = 'GLOBUSUPLOADREMOTEFAILURE',
  GLOBUS_UPLOAD_LOCAL_FAILURE = 'GLOBUSUPLOADLOCALFAILURE',
  PID_RECONCILED = 'PIDRECONCILED'
}

export interface RoleAssignment {
  id: number
  assignee: string
  definitionPointId: number
  roleId: number
  roleName: string
  _roleAlias: string
}

export interface Notification {
  id: number
  type: NotificationType
  subjectText?: string
  messageText?: string
  sentTimestamp: string
  displayAsRead: boolean
  installationBrandName?: string
  userGuidesBaseUrl?: string
  userGuidesVersion?: string
  userGuidesSectionPath?: string
  roleAssignments?: RoleAssignment[]
  dataverseAlias?: string
  dataverseDisplayName?: string
  datasetPersistentIdentifier?: string
  datasetDisplayName?: string
  ownerPersistentIdentifier?: string
  ownerAlias?: string
  ownerDisplayName?: string
  requestorFirstName?: string
  requestorLastName?: string
  requestorEmail?: string
  dataFileId?: number
  dataFileDisplayName?: string
  currentCurationStatus?: string
  additionalInfo?: string
  objectDeleted?: boolean
}
