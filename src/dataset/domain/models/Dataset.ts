import { AlertVariant } from '@iqss/dataverse-design-system/dist/components/alert/AlertVariant'

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

export enum DatasetAlertMessageKey {
  DRAFT_VERSION = 'draftVersion',
  REQUESTED_VERSION_NOT_FOUND = 'requestedVersionNotFound',
  UNPUBLISHED_DATASET = 'unpublishedDataset'
}

export class DatasetAlert {
  constructor(
    public readonly variant: AlertVariant,
    public readonly message: DatasetAlertMessageKey,
    public readonly dynamicFields?: {},
    public readonly customHeading?: string
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
  EMBARGOED = 'embargoed',
  IN_REVIEW = 'inReview'
}

export enum DatasetNonNumericVersion {
  LATEST = ':latest',
  DRAFT = ':draft'
}

export class DatasetVersion {
  constructor(
    public readonly id: number,
    public readonly publishingStatus: DatasetPublishingStatus,
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

export class Dataset {
  constructor(
    public readonly persistentId: string,
    public readonly version: DatasetVersion,
    public readonly citation: string,
    public readonly labels: DatasetLabel[],
    public readonly alerts: DatasetAlert[],
    public readonly summaryFields: DatasetMetadataBlock[],
    public readonly license: DatasetLicense,
    public readonly metadataBlocks: DatasetMetadataBlocks
  ) {}

  public getTitle(): string {
    return this.metadataBlocks[0].fields.title
  }

  static Builder = class {
    public readonly labels: DatasetLabel[] = []
    public readonly alerts: DatasetAlert[] = []

    constructor(
      public readonly persistentId: string,
      public readonly version: DatasetVersion,
      public readonly citation: string,
      public readonly summaryFields: DatasetMetadataBlock[],
      public readonly license: DatasetLicense = defaultLicense,
      public readonly metadataBlocks: DatasetMetadataBlocks,
      public readonly privateUrl?: string
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

      if (this.version.publishingStatus !== DatasetPublishingStatus.RELEASED) {
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

      if (this.version.publishingStatus === DatasetPublishingStatus.IN_REVIEW) {
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
      if (this.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
        this.alerts.push(
          new DatasetAlert('warning', DatasetAlertMessageKey.DRAFT_VERSION, undefined, 'Info')
        )
      }
      if (this.version.requestedVersion) {
        const dynamicFields = {
          requestedVersion: this.version.requestedVersion,
          returnedVersion: `${this.version.toString()}`
        }

        this.alerts.push(
          new DatasetAlert(
            'info',
            DatasetAlertMessageKey.REQUESTED_VERSION_NOT_FOUND,
            dynamicFields
          )
        )
      }
      if (this.privateUrl) {
        const dynamicFields = { privateUrl: this.privateUrl }
        this.alerts.push(
          new DatasetAlert(
            'info',
            DatasetAlertMessageKey.UNPUBLISHED_DATASET,
            dynamicFields,
            'Unpublished Dataset Private URL'
          )
        )
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
        this.metadataBlocks
      )
    }
  }
}
