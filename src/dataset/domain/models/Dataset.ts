export enum LabelSemanticMeaning {
  DATASET = 'dataset',
  FILE = 'file',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger'
}

export class DatasetLabel {
  constructor(
    public readonly semanticMeaning: LabelSemanticMeaning,
    public readonly value: string
  ) {}
}

export type DatasetMetadataSubField = Record<string, string>

export const ANONYMIZED_FIELD_VALUE = 'withheld'
type AnonymizedField = typeof ANONYMIZED_FIELD_VALUE

export type DatasetMetadataFieldValue =
  | string
  | string[]
  | DatasetMetadataSubField
  | DatasetMetadataSubField[]
  | AnonymizedField

export type DatasetMetadataFields = Record<string, DatasetMetadataFieldValue>

export enum MetadataBlockName {
  CITATION = 'citation',
  GEOSPATIAL = 'geospatial',
  ASTROPHYSICS = 'astrophysics',
  BIOMEDICAL = 'biomedical',
  CODE_META = 'codeMeta20',
  COMPUTATIONAL_WORKFLOW = 'computationalworkflow',
  CUSTOM_ARCS = 'customARCS',
  CUSTOM_CHIA = 'customCHIA',
  CUSTOM_DIGAAI = 'customDigaai',
  CUSTOM_GSD = 'customGSD',
  CUSTOM_MRA = 'customMRA',
  CUSTOM_PSI = 'customPSI',
  CUSTOM_PSRI = 'customPSRI',
  CUSTOM_HBGDKI = 'custom_hbgdki',
  JOURNAL = 'journal',
  SOCIAL_SCIENCE = 'socialscience'
}

export interface DatasetMetadataBlock {
  name: MetadataBlockName
  fields: DatasetMetadataFields
}

export interface DatasetLicense {
  name: string
  uri: string
  iconUrl?: string
}

export enum DatasetStatus {
  RELEASED = 'published',
  UNPUBLISHED = 'unpublished',
  DRAFT = 'draft',
  DEACCESSIONED = 'deaccessioned',
  EMBARGOED = 'embargoed',
  IN_REVIEW = 'inReview'
}

export interface DatasetVersion {
  majorNumber: number
  minorNumber: number
}

export interface DatasetCitation {
  citationText: string
  url: string
  publisher: string
  unf?: string
}

export class Dataset {
  constructor(
    public readonly persistentId: string,
    public readonly title: string,
    public readonly version: DatasetVersion | null,
    public readonly status: DatasetStatus,
    public readonly citation: DatasetCitation,
    public readonly labels: DatasetLabel[],
    public readonly summaryFields: DatasetMetadataBlock[],
    public readonly license: DatasetLicense,
    public readonly metadataBlocks: DatasetMetadataBlock[]
  ) {}

  static Builder = class {
    public readonly labels: DatasetLabel[] = []

    constructor(
      public readonly persistentId: string,
      public readonly title: string,
      public readonly version: DatasetVersion,
      public readonly status: DatasetStatus,
      public readonly citation: DatasetCitation,
      public readonly summaryFields: DatasetMetadataBlock[],
      public readonly license: DatasetLicense,
      public readonly metadataBlocks: DatasetMetadataBlock[]
    ) {
      this.withLabels(status, version)
    }

    withLabels(status: DatasetStatus, version: DatasetVersion) {
      this.withStatusLabel(status)
      this.withVersionLabel(status, version)
    }

    private withStatusLabel(status: DatasetStatus): void {
      if (status === DatasetStatus.DRAFT) {
        this.labels.push(new DatasetLabel(LabelSemanticMeaning.DATASET, DatasetStatus.DRAFT))
      }

      if (status === DatasetStatus.UNPUBLISHED) {
        this.labels.push(new DatasetLabel(LabelSemanticMeaning.WARNING, DatasetStatus.UNPUBLISHED))
      }

      if (status === DatasetStatus.DEACCESSIONED) {
        this.labels.push(new DatasetLabel(LabelSemanticMeaning.DANGER, DatasetStatus.DEACCESSIONED))
      }

      if (status === DatasetStatus.EMBARGOED) {
        this.labels.push(new DatasetLabel(LabelSemanticMeaning.DATASET, DatasetStatus.EMBARGOED))
      }

      if (status === DatasetStatus.IN_REVIEW) {
        this.labels.push(new DatasetLabel(LabelSemanticMeaning.SUCCESS, DatasetStatus.IN_REVIEW))
      }
    }

    private withVersionLabel(status: DatasetStatus, version: DatasetVersion): void {
      if (status === DatasetStatus.RELEASED) {
        this.labels.push(
          new DatasetLabel(
            LabelSemanticMeaning.FILE,
            `Version ${version.majorNumber}.${version.minorNumber}`
          )
        )
      }
    }

    build(): Dataset {
      return new Dataset(
        this.persistentId,
        this.title,
        this.version,
        this.status,
        this.citation,
        this.labels,
        this.summaryFields,
        this.license,
        this.metadataBlocks
      )
    }
  }
}
