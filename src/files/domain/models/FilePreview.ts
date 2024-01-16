import FileTypeToFriendlyTypeMap from './FileTypeToFriendlyTypeMap'

export enum FileSizeUnit {
  BYTES = 'B',
  KILOBYTES = 'KB',
  MEGABYTES = 'MB',
  GIGABYTES = 'GB',
  TERABYTES = 'TB',
  PETABYTES = 'PB'
}

export class FileSize {
  static readonly multiplier = {
    [FileSizeUnit.BYTES]: 1,
    [FileSizeUnit.KILOBYTES]: 1024,
    [FileSizeUnit.MEGABYTES]: 1024 ** 2,
    [FileSizeUnit.GIGABYTES]: 1024 ** 3,
    [FileSizeUnit.TERABYTES]: 1024 ** 4,
    [FileSizeUnit.PETABYTES]: 1024 ** 5
  }

  constructor(readonly value: number, readonly unit: FileSizeUnit) {
    ;[this.value, this.unit] = FileSize.convertToLargestUnit(value, unit)
  }

  toString(): string {
    const formattedValue =
      this.value % 1 === 0 ? this.value.toFixed(0) : (Math.round(this.value * 10) / 10).toString()
    return `${formattedValue} ${this.unit}`
  }

  toBytes(): number {
    return this.value * FileSize.multiplier[this.unit]
  }

  static convertToLargestUnit(value: number, unit: FileSizeUnit): [number, FileSizeUnit] {
    let convertedValue = value
    let convertedUnit = unit

    while (convertedValue >= 1024 && convertedUnit !== FileSizeUnit.PETABYTES) {
      convertedValue /= 1024
      convertedUnit = this.getNextUnit(convertedUnit)
    }

    return [convertedValue, convertedUnit]
  }

  static getNextUnit(unit: FileSizeUnit): FileSizeUnit {
    switch (unit) {
      case FileSizeUnit.BYTES:
        return FileSizeUnit.KILOBYTES
      case FileSizeUnit.KILOBYTES:
        return FileSizeUnit.MEGABYTES
      case FileSizeUnit.MEGABYTES:
        return FileSizeUnit.GIGABYTES
      case FileSizeUnit.GIGABYTES:
        return FileSizeUnit.TERABYTES
      case FileSizeUnit.TERABYTES:
        return FileSizeUnit.PETABYTES
      default:
        return unit
    }
  }
}

export enum FileDownloadMode {
  ORIGINAL = 'original',
  ARCHIVAL = 'archival'
}

export class FileDownloadSize extends FileSize {
  constructor(
    readonly value: number,
    readonly unit: FileSizeUnit,
    readonly mode: FileDownloadMode
  ) {
    super(value, unit)
    ;[this.value, this.unit] = FileDownloadSize.convertToLargestUnit(value, unit)
  }
}

export interface FileAccess {
  restricted: boolean
  latestVersionRestricted: boolean
  canBeRequested: boolean
  requested: boolean
}

export enum FilePublishingStatus {
  DRAFT = 'draft',
  RELEASED = 'released',
  DEACCESSIONED = 'deaccessioned'
}

export interface FileVersion {
  number: number
  publishingStatus: FilePublishingStatus
}

export enum FileDateType {
  METADATA_RELEASED = 'metadataReleased',
  PUBLISHED = 'published',
  DEPOSITED = 'deposited'
}

export enum FileVersionNotNumber {
  LATEST = 'latest',
  DRAFT = 'draft'
}

export interface FileDate {
  type: FileDateType
  date: Date
}

export class FileEmbargo {
  constructor(readonly dateAvailable: Date, readonly reason?: string) {}

  get isActive(): boolean {
    return this.dateAvailable > new Date()
  }
}

export interface FileTabularData {
  variablesCount: number
  observationsCount: number
  unf?: string
}

export enum FileLabelType {
  CATEGORY = 'category',
  TAG = 'tag'
}

export interface FileLabel {
  type: FileLabelType
  value: string
}

export class FileType {
  constructor(readonly value: string, readonly original?: string) {}

  toDisplayFormat(): string {
    return FileTypeToFriendlyTypeMap[this.value] || FileTypeToFriendlyTypeMap.unknown
  }
}

export interface FileChecksum {
  algorithm: string
  value: string
}

export enum FileIngestStatus {
  NONE = 'none',
  IN_PROGRESS = 'inProgress',
  SCHEDULED = 'scheduled',
  ERROR = 'error'
}

export interface FileIngest {
  status: FileIngestStatus
  reportMessage?: string
}

export interface FileDownloadUrls {
  original: string
  tabular?: string
  rData?: string
}

export class FilePreview {
  constructor(
    readonly id: number,
    readonly version: FileVersion,
    readonly name: string,
    readonly access: FileAccess,
    readonly type: FileType,
    readonly size: FileSize,
    readonly date: FileDate,
    readonly downloadCount: number,
    readonly labels: FileLabel[],
    public readonly isDeleted: boolean,
    public readonly ingest: FileIngest,
    public readonly downloadUrls: FileDownloadUrls,
    public thumbnail?: string,
    readonly directory?: string,
    readonly embargo?: FileEmbargo,
    readonly tabularData?: FileTabularData,
    readonly description?: string,
    readonly checksum?: FileChecksum
  ) {}

  get isActivelyEmbargoed(): boolean {
    if (this.embargo) {
      return this.embargo.isActive
    }
    return false
  }
}