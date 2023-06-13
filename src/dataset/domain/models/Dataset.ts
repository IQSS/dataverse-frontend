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
    public readonly status: DatasetStatus
  ) {}

  toString(): string {
    return `${this.majorNumber}.${this.minorNumber}`
  }
}

export class Dataset {
  constructor(
    public readonly persistentId: string,
    public readonly title: string,
    public readonly version: DatasetVersion,
    public readonly citation: string,
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
      public readonly citation: string,
      public readonly summaryFields: DatasetMetadataBlock[],
      public readonly license: DatasetLicense = defaultLicense,
      public readonly metadataBlocks: DatasetMetadataBlock[]
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
        this.title,
        this.version,
        this.citation,
        this.labels,
        this.summaryFields,
        this.license,
        this.metadataBlocks
      )
    }
  }
}
