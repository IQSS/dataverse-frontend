import { Alert, AlertMessageKey } from '../../../alert/domain/models/Alert'
import { FileDownloadSize } from '../../../files/domain/models/File'

export enum DatasetLabelSemanticMeaning {
  DATASET = 'dataset',
  FILE = 'file',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger'
}

export enum DatasetLabelValue {
  DRAFT = 'Draft',
  UNPUBLISHED = 'Unpublished',
  DEACCESSIONED = 'Deaccessioned',
  EMBARGOED = 'Embargoed',
  IN_REVIEW = 'In Review'
}

export class DatasetLabel {
  constructor(
    public readonly semanticMeaning: DatasetLabelSemanticMeaning,
    public readonly value: DatasetLabelValue | `Version ${string}`
  ) {}
}

export enum MetadataBlockName {
  CITATION = 'citation',
  GEOSPATIAL = 'geospatial',
  ASTROPHYSICS = 'astrophysics',
  BIOMEDICAL = 'biomedical',
  CODE_META = 'codeMeta20',
  COMPUTATIONAL_WORKFLOW = 'computationalworkflow',
  JOURNAL = 'journal',
  SOCIAL_SCIENCE = 'socialscience'
}

export type DatasetMetadataBlocks = [CitationMetadataBlock, ...DatasetMetadataBlock[]]

export interface DatasetMetadataBlock {
  name: MetadataBlockName
  fields: DatasetMetadataFields
}

export type DatasetMetadataFields = Record<string, DatasetMetadataFieldValue>

export const ANONYMIZED_FIELD_VALUE = 'withheld'
type AnonymizedField = typeof ANONYMIZED_FIELD_VALUE

export type DatasetMetadataFieldValue =
  | string
  | string[]
  | DatasetMetadataSubField
  | DatasetMetadataSubField[]
  | AnonymizedField

export type DatasetMetadataSubField = Record<string, string | undefined>

export interface CitationMetadataBlock extends DatasetMetadataBlock {
  name: MetadataBlockName.CITATION
  fields: {
    alternativePersistentId?: string
    publicationDate?: string
    citationDate?: string
    title: string
    author: Author[] | AnonymizedField
    datasetContact: DatasetContact[] | AnonymizedField
    dsDescription: DatasetDescription[] | AnonymizedField
    subject: string[] | AnonymizedField
    subtitle?: string
    alternativeTitle?: string
    alternativeURL?: string
    otherId?: OtherId[] | AnonymizedField
    keyword?: Keyword[] | AnonymizedField
    topicClassification?: TopicClassification[] | AnonymizedField
    publication?: Publication[] | AnonymizedField
    notesText?: string
    language?: string[] | AnonymizedField
    producer?: Producer[] | AnonymizedField
    productionDate?: string
    productionPlace?: string[] | AnonymizedField
    contributor?: Contributor[] | AnonymizedField
    grantNumber?: GrantNumber[] | AnonymizedField
    distributor?: Distributor[] | AnonymizedField
    distributionDate?: string
    depositor?: string
    dateOfDeposit?: string
    timePeriodCovered?: TimePeriodCovered[] | AnonymizedField
    dateOfCollection?: DateOfCollection[] | AnonymizedField
    kindOfData?: string[] | AnonymizedField
    series?: Series[] | AnonymizedField
    software?: Software[] | AnonymizedField
    relatedMaterial?: string[] | AnonymizedField
    relatedDatasets?: string[] | AnonymizedField
    otherReferences?: string[] | AnonymizedField
    dataSources?: string[] | AnonymizedField
    originOfSources?: string
    characteristicOfSources?: string
    accessToSources?: string
  }
}

interface OtherId extends DatasetMetadataSubField {
  otherIdAgency: string
  otherIdValue: string
}

export interface Author extends DatasetMetadataSubField {
  authorName: string
  authorAffiliation: string
  authorIdentifierScheme?: string
  authorIdentifier?: string
}

export interface DatasetContact extends DatasetMetadataSubField {
  datasetContactName: string
  datasetContactEmail: string
  datasetContactAffiliation?: string
}

export interface DatasetDescription extends DatasetMetadataSubField {
  dsDescriptionValue: string
  dsDescriptionDate?: string
}

interface Keyword extends DatasetMetadataSubField {
  keywordValue?: string
  keywordVocabulary?: string
  keywordVocabularyURI?: string
}

interface TopicClassification extends DatasetMetadataSubField {
  topicClassValue?: string
  topicClassVocab?: string
  topicClassVocabURI?: string
}

interface Publication extends DatasetMetadataSubField {
  publicationCitation?: string
  publicationIDType?: string
  publicationIDNumber?: string
  publicationURL?: string
}

interface Producer extends DatasetMetadataSubField {
  producerName?: string
  producerAffiliation?: string
  producerAbbreviation?: string
  producerURL?: string
  producerLogoURL?: string
}

interface Contributor extends DatasetMetadataSubField {
  contributorType?: string
  contributorName?: string
}

interface GrantNumber extends DatasetMetadataSubField {
  grantNumberAgency?: string
  grantNumberValue?: string
}

interface Distributor extends DatasetMetadataSubField {
  distributorName?: string
  distributorAffiliation?: string
  distributorAbbreviation?: string
  distributorURL?: string
  distributorLogoURL?: string
}

interface TimePeriodCovered extends DatasetMetadataSubField {
  timePeriodCoveredStart?: string
  timePeriodCoveredEnd?: string
}

interface DateOfCollection extends DatasetMetadataSubField {
  dateOfCollectionStart?: string
  dateOfCollectionEnd?: string
}

interface Series extends DatasetMetadataSubField {
  seriesName?: string
  seriesInformation?: string
}

interface Software extends DatasetMetadataSubField {
  softwareName?: string
  softwareVersion?: string
}

export interface DatasetLicense {
  name: string
  uri: string
  iconUri?: string
}

const defaultLicense: DatasetLicense = {
  name: 'CC0 1.0',
  uri: 'https://creativecommons.org/publicdomain/zero/1.0',
  iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
}

export enum DatasetPublishingStatus {
  RELEASED = 'released',
  DRAFT = 'draft',
  DEACCESSIONED = 'deaccessioned',
  EMBARGOED = 'embargoed'
}

export enum DatasetNonNumericVersion {
  LATEST = ':latest',
  DRAFT = ':draft'
}

export class DatasetVersion {
  constructor(
    public readonly id: number,
    public readonly publishingStatus: DatasetPublishingStatus,
    public readonly isLatest: boolean,
    public readonly isInReview: boolean,
    public readonly latestVersionStatus: DatasetPublishingStatus,
    public readonly majorNumber?: number,
    public readonly minorNumber?: number,
    // requestedVersion will be set if the user requested a version that did not exist.
    public readonly requestedVersion?: string
  ) {}

  toString(): string | DatasetNonNumericVersion {
    if (this.majorNumber === undefined || this.minorNumber === undefined) {
      return DatasetNonNumericVersion.DRAFT
    }
    return `${this.majorNumber}.${this.minorNumber}`
  }
}

export interface DatasetPermissions {
  canDownloadFiles: boolean
  canUpdateDataset: boolean
  canPublishDataset: boolean
  canManageDatasetPermissions: boolean
  canManageFilesPermissions: boolean
  canDeleteDataset: boolean
}

export interface DatasetLock {
  userPersistentId: string
  reason: DatasetLockReason
}

export enum DatasetLockReason {
  INGEST = 'Ingest',
  WORKFLOW = 'Workflow',
  IN_REVIEW = 'InReview',
  DCM_UPLOAD = 'DcmUpload',
  GLOBUS_UPLOAD = 'GlobusUpload',
  FINALIZE_PUBLICATION = 'finalizePublication',
  EDIT_IN_PROGRESS = 'EditInProgress',
  FILE_VALIDATION_FAILED = 'FileValidationFailed'
}

export interface PrivateUrl {
  token: string
  urlSnippet: string
}

export class Dataset {
  constructor(
    public readonly persistentId: string,
    public readonly version: DatasetVersion,
    public readonly citation: string,
    public readonly labels: DatasetLabel[],
    public readonly alerts: Alert[],
    public readonly summaryFields: DatasetMetadataBlock[],
    public readonly license: DatasetLicense,
    public readonly metadataBlocks: DatasetMetadataBlocks,
    public readonly permissions: DatasetPermissions,
    public readonly locks: DatasetLock[],
    public readonly hasValidTermsOfAccess: boolean,
    public readonly hasOneTabularFileAtLeast: boolean,
    public readonly isValid: boolean,
    public readonly isReleased: boolean,
    public readonly thumbnail?: string,
    public readonly privateUrl?: PrivateUrl,
    public readonly fileDownloadSizes?: FileDownloadSize[]
  ) {}

  public getTitle(): string {
    return this.metadataBlocks[0].fields.title
  }

  public checkIsLockedFromPublishing(userPersistentId: string): boolean {
    return this.checkIsLockedFromEdits(userPersistentId)
  }

  public get isLocked(): boolean {
    return this.locks.length > 0
  }

  public get isLockedInWorkflow(): boolean {
    return this.locks.some((lock) => lock.reason === DatasetLockReason.WORKFLOW)
  }

  public checkIsLockedFromEdits(userPersistentId: string): boolean {
    const lockedReasonIsInReview = this.locks.some(
      (lock) => lock.reason === DatasetLockReason.IN_REVIEW
    )

    if (
      this.locks.some(
        (lock) =>
          lock.reason === DatasetLockReason.WORKFLOW && lock.userPersistentId === userPersistentId
      )
    ) {
      return false
    }

    return this.isLocked && !(lockedReasonIsInReview && this.permissions.canPublishDataset)
  }

  public get isLockedFromFileDownload(): boolean {
    if (!this.isLocked) {
      return false
    }

    if (
      this.locks.some((lock) =>
        [
          DatasetLockReason.FINALIZE_PUBLICATION,
          DatasetLockReason.DCM_UPLOAD,
          DatasetLockReason.INGEST
        ].includes(lock.reason)
      )
    ) {
      return true
    }

    if (
      this.locks.some((lock) => lock.reason === DatasetLockReason.IN_REVIEW) &&
      !this.permissions.canUpdateDataset
    ) {
      return true
    }

    // If the lock reason is workflow and the workflow userId is different than the current user, then is locked
    // TODO - Ask how we want to manage pending workflows

    return false
  }

  static Builder = class {
    public readonly labels: DatasetLabel[] = []
    public readonly alerts: Alert[] = []

    constructor(
      public readonly persistentId: string,
      public readonly version: DatasetVersion,
      public readonly citation: string,
      public readonly summaryFields: DatasetMetadataBlock[],
      public readonly license: DatasetLicense = defaultLicense,
      public readonly metadataBlocks: DatasetMetadataBlocks,
      public readonly permissions: DatasetPermissions,
      public readonly locks: DatasetLock[],
      public readonly hasValidTermsOfAccess: boolean,
      public readonly hasOneTabularFileAtLeast: boolean,
      public readonly isValid: boolean,
      public readonly isReleased: boolean,
      public readonly thumbnail?: string,
      public readonly privateUrl?: PrivateUrl,
      public readonly fileDownloadSizes?: FileDownloadSize[]
    ) {
      this.withLabels()
      this.withAlerts()
    }

    withLabels() {
      this.withStatusLabel()
      this.withVersionLabel()
    }

    private withStatusLabel(): void {
      if (this.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.DRAFT)
        )
      }

      if (!this.isReleased) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.WARNING, DatasetLabelValue.UNPUBLISHED)
        )
      }

      if (this.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.DANGER, DatasetLabelValue.DEACCESSIONED)
        )
      }

      if (this.version.publishingStatus === DatasetPublishingStatus.EMBARGOED) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.EMBARGOED)
        )
      }

      if (this.version.isInReview) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.SUCCESS, DatasetLabelValue.IN_REVIEW)
        )
      }
    }

    private withVersionLabel(): void {
      if (this.version.publishingStatus === DatasetPublishingStatus.RELEASED) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.FILE, `Version ${this.version.toString()}`)
        )
      }
    }

    private withAlerts(): void {
      if (
        this.version.publishingStatus === DatasetPublishingStatus.DRAFT &&
        this.permissions.canPublishDataset
      ) {
        this.alerts.push(new Alert('warning', AlertMessageKey.DRAFT_VERSION))
      }
      if (this.version.requestedVersion) {
        if (this.version.latestVersionStatus == DatasetPublishingStatus.RELEASED) {
          const dynamicFields = {
            requestedVersion: this.version.requestedVersion,
            returnedVersion: `${this.version.toString()}`
          }
          this.alerts.push(
            new Alert('warning', AlertMessageKey.REQUESTED_VERSION_NOT_FOUND, dynamicFields)
          )
        } else {
          const dynamicFields = {
            requestedVersion: this.version.requestedVersion
          }
          this.alerts.push(
            new Alert(
              'warning',
              AlertMessageKey.REQUESTED_VERSION_NOT_FOUND_SHOW_DRAFT,
              dynamicFields
            )
          )
        }
      }
      if (this.privateUrl) {
        if (this.permissions.canPublishDataset) {
          const dynamicFields = { privateUrl: this.privateUrl.urlSnippet + this.privateUrl.token }
          this.alerts.push(
            new Alert('info', AlertMessageKey.SHARE_UNPUBLISHED_DATASET, dynamicFields)
          )
        } else {
          this.alerts.push(new Alert('warning', AlertMessageKey.UNPUBLISHED_DATASET))
        }
      }
    }

    build(): Dataset {
      return new Dataset(
        this.persistentId,
        this.version,
        this.citation,
        this.labels,
        this.alerts,
        this.summaryFields,
        this.license,
        this.metadataBlocks,
        this.permissions,
        this.locks,
        this.hasValidTermsOfAccess,
        this.hasOneTabularFileAtLeast,
        this.isValid,
        this.isReleased,
        this.thumbnail,
        this.privateUrl,
        this.fileDownloadSizes
      )
    }
  }
}
