export enum NotificationType {
  ASSIGN_ROLE = 'assignRole',
  REVOKE_ROLE = 'revokeRole',
  CREATE_COLLECTION = 'createCollection',
  CREATE_DATASET = 'createDataset',
  CREATE_ACC = 'createAcc',
  SUBMITTED_DS = 'submittedDataset',
  RETURNED_DS = 'returnedDataset',
  PUBLISHED_DS = 'publishedDataset',
  REQUEST_FILE_ACCESS = 'requestFileAccess',
  GRANT_FILE_ACCESS = 'grantFileAccess',
  REJECT_FILE_ACCESS = 'rejectFileAccess',
  FILE_SYSTEM_IMPORT = 'fileSystemImport',
  CHECKSUM_IMPORT = 'checksumImport',
  CHECKSUM_FAIL = 'checksumFail',
  CONFIRM_EMAIL = 'confirmEmail',
  API_GENERATED = 'apiGenerated',
  INGEST_COMPLETED = 'ingestCompleted',
  INGEST_COMPLETED_WITH_ERRORS = 'ingestCompletedWithErrors',
  PUBLISH_FAILED_PIDREG = 'publishFailedPidReg',
  WORKFLOW_SUCCESS = 'workflowSuccess',
  WORKFLOW_FAILURE = 'workflowFailure',
  STATUS_UPDATED = 'statusUpdated',
  DATASET_CREATED = 'datasetCreated',
  DATASET_MENTIONED = 'datasetMentioned',
  GLOBUS_UPLOAD_COMPLETED = 'globusUploadCompleted',
  GLOBUS_UPLOAD_COMPLETED_WITH_ERRORS = 'globusUploadCompletedWithErrors',
  GLOBUS_DOWNLOAD_COMPLETED = 'globusDownloadCompleted',
  GLOBUS_DOWNLOAD_COMPLETED_WITH_ERRORS = 'globusDownloadCompletedWithErrors',
  REQUESTED_FILE_ACCESS = 'requestedFileAccess',
  GLOBUS_UPLOAD_REMOTE_FAILURE = 'globusUploadRemoteFailure',
  GLOBUS_UPLOAD_LOCAL_FAILURE = 'globusUploadLocalFailure',
  PID_RECONCILED = 'pidReconciled'
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
  collectionAlias?: string
  collectionDisplayName?: string
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
