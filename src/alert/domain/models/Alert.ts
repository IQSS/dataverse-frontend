import { AlertVariant } from '@iqss/dataverse-design-system/dist/components/alert/AlertVariant'

export enum AlertMessageKey {
  DRAFT_VERSION = 'draftVersion',
  REQUESTED_VERSION_NOT_FOUND = 'requestedVersionNotFound',
  REQUESTED_VERSION_NOT_FOUND_SHOW_DRAFT = 'requestedVersionNotFoundShowDraft',
  SHARE_UNPUBLISHED_DATASET = 'shareUnpublishedDataset',
  UNPUBLISHED_DATASET = 'unpublishedDataset',
  METADATA_UPDATED = 'metadataUpdated',
  FILES_UPDATED = 'filesUpdated',
  TERMS_UPDATED = 'termsUpdated',
  THUMBNAIL_UPDATED = 'thumbnailUpdated',
  DATASET_DELETED = 'datasetDeleted',
  DATASET_CREATED = 'datasetCreated',
  PUBLISH_IN_PROGRESS = 'publishInProgress'
}

export class Alert {
  constructor(
    public readonly variant: AlertVariant,
    public readonly messageKey: AlertMessageKey,
    public dynamicFields?: object
  ) {}
}
