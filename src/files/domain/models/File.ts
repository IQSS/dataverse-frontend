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
    ;[this.value, this.unit] = this.convertToLargestUnit(value, unit)
  }

  toString(): string {
    const formattedValue =
      this.value % 1 === 0 ? this.value.toFixed(0) : (Math.round(this.value * 10) / 10).toString()
    return `${formattedValue} ${this.unit}`
  }

  toBytes(): number {
    return this.value * FileSize.multiplier[this.unit]
  }

  private convertToLargestUnit(value: number, unit: FileSizeUnit): [number, FileSizeUnit] {
    let convertedValue = value
    let convertedUnit = unit

    while (convertedValue >= 1024 && convertedUnit !== FileSizeUnit.PETABYTES) {
      convertedValue /= 1024
      convertedUnit = this.getNextUnit(convertedUnit)
    }

    return [convertedValue, convertedUnit]
  }

  private getNextUnit(unit: FileSizeUnit): FileSizeUnit {
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

export enum FileDownloadSizeMode {
  ALL = 'All',
  ORIGINAL = 'Original',
  ARCHIVAL = 'Archival'
}

export class FileDownloadSize extends FileSize {
  constructor(
    readonly value: number,
    readonly unit: FileSizeUnit,
    readonly mode: FileDownloadSizeMode
  ) {
    super(value, unit)
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
  constructor(readonly dateAvailable: Date) {}

  get isActive(): boolean {
    return this.dateAvailable > new Date()
  }
}

export interface FileTabularData {
  variablesCount: number
  observationsCount: number
  unf: string
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

export class File {
  constructor(
    readonly id: number,
    readonly version: FileVersion,
    readonly name: string,
    readonly access: FileAccess,
    readonly type: FileType,
    readonly size: FileSize,
    readonly date: FileDate,
    public downloadCount: number,
    readonly labels: FileLabel[],
    public readonly isDeleted: boolean,
    public readonly ingest: FileIngest,
    readonly checksum?: FileChecksum,
    public thumbnail?: string,
    readonly directory?: string,
    readonly embargo?: FileEmbargo,
    readonly tabularData?: FileTabularData,
    readonly description?: string
  ) {}

  getLink(): string {
    return `/file?id=${this.id}&version=${this.version.number}`
  }

  get isActivelyEmbargoed(): boolean {
    if (this.embargo) {
      return this.embargo.isActive
    }
    return false
  }

  get isTabularData(): boolean {
    return this.tabularData !== undefined
  }
}
