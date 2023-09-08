import exp from 'constants'

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

export enum DatasetStatus {
  RELEASED = 'released',
  DRAFT = 'draft',
  DEACCESSIONED = 'deaccessioned',
  EMBARGOED = 'embargoed',
  IN_REVIEW = 'inReview'
}

export class DatasetVersion {
  constructor(
    public readonly majorNumber: number,
    public readonly minorNumber: number,
    public readonly status: DatasetStatus,
    public readonly isLatest: boolean
  ) {}

  toString(): string {
    return `${this.majorNumber}.${this.minorNumber}`
  }
}

export interface DatasetPermissions {
  canDownloadFiles: boolean
  canUpdateDataset: boolean
  canPublishDataset: boolean
}

export interface DatasetLock {
  id: number
  reason: DatasetLockReason
}

export enum DatasetLockReason {
  INGEST = 'ingest',
  WORKFLOW = 'workflow',
  IN_REVIEW = 'inReview',
  DCM_UPLOAD = 'dcmUpload',
  GLOBUS_UPLOAD = 'globusUpload',
  FINALIZE_PUBLICATION = 'finalizePublication',

  EDIT_IN_PROGRESS = 'editInProgress',
  FILE_VALIDATION_FAILED = 'fileValidationFailed'
}

export class Dataset {
  constructor(
    public readonly persistentId: string,
    public readonly version: DatasetVersion,
    public readonly citation: string,
    public readonly labels: DatasetLabel[],
    public readonly summaryFields: DatasetMetadataBlock[],
    public readonly license: DatasetLicense,
    public readonly metadataBlocks: DatasetMetadataBlocks,
    public readonly permissions: DatasetPermissions,
    public readonly locks: DatasetLock[]
  ) {}

  public getTitle(): string {
    return this.metadataBlocks[0].fields.title
  }

  public get isLockedFromPublishing(): boolean {
    const lockedReasonIsInReview = this.locks.some(
      (lock) => lock.reason === DatasetLockReason.IN_REVIEW
    )

    return this.isLocked && !(lockedReasonIsInReview && this.permissions.canPublishDataset)
  }

  public get isLocked(): boolean {
    return this.locks.length > 0
  }

  static Builder = class {
    public readonly labels: DatasetLabel[] = []

    constructor(
      public readonly persistentId: string,
      public readonly version: DatasetVersion,
      public readonly citation: string,
      public readonly summaryFields: DatasetMetadataBlock[],
      public readonly license: DatasetLicense = defaultLicense,
      public readonly metadataBlocks: DatasetMetadataBlocks,
      public readonly permissions: DatasetPermissions,
      public readonly locks: DatasetLock[]
    ) {
      this.withLabels()
    }

    withLabels() {
      this.withStatusLabel()
      this.withVersionLabel()
    }

    private withStatusLabel(): void {
      if (this.version.status === DatasetStatus.DRAFT) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.DRAFT)
        )
      }

      if (this.version.status !== DatasetStatus.RELEASED) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.WARNING, DatasetLabelValue.UNPUBLISHED)
        )
      }

      if (this.version.status === DatasetStatus.DEACCESSIONED) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.DANGER, DatasetLabelValue.DEACCESSIONED)
        )
      }

      if (this.version.status === DatasetStatus.EMBARGOED) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.EMBARGOED)
        )
      }

      if (this.version.status === DatasetStatus.IN_REVIEW) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.SUCCESS, DatasetLabelValue.IN_REVIEW)
        )
      }
    }

    private withVersionLabel(): void {
      if (this.version.status === DatasetStatus.RELEASED) {
        this.labels.push(
          new DatasetLabel(DatasetLabelSemanticMeaning.FILE, `Version ${this.version.toString()}`)
        )
      }
    }

    build(): Dataset {
      return new Dataset(
        this.persistentId,
        this.version,
        this.citation,
        this.labels,
        this.summaryFields,
        this.license,
        this.metadataBlocks,
        this.permissions,
        this.locks
      )
    }
  }
}
