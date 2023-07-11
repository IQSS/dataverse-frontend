export enum FileSizeUnit {
  BYTES = 'B',
  KILOBYTES = 'KB',
  MEGABYTES = 'MB',
  GIGABYTES = 'GB',
  TERABYTES = 'TB',
  PETABYTES = 'PB'
}

export class FileSize {
  constructor(readonly value: number, readonly unit: FileSizeUnit) {}

  toString(): string {
    return `${this.value} ${this.unit}`
  }
}

export interface FileAccess {
  restricted: boolean
  canDownload: boolean
}

export enum FileStatus {
  DRAFT = 'draft',
  RELEASED = 'released'
}

export class FileVersion {
  constructor(
    public readonly majorNumber: number,
    public readonly minorNumber: number,
    public readonly status: FileStatus
  ) {}

  toString(): string {
    return `${this.majorNumber}.${this.minorNumber}`
  }
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
  date: string
}

export interface FileEmbargo {
  active: boolean
  date: string
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
  constructor(readonly value: string) {}

  toDisplayFormat(): string {
    const words = this.value.split(' ')
    return words
      .map((word) => {
        return word[0].toUpperCase() + word.substring(1)
      })
      .join(' ')
  }
}

export class File {
  constructor(
    readonly id: string,
    readonly version: FileVersion,
    readonly name: string,
    readonly access: FileAccess,
    readonly type: FileType,
    readonly size: FileSize,
    readonly date: FileDate,
    readonly downloads: number,
    readonly labels: FileLabel[],
    readonly checksum?: string,
    readonly thumbnail?: string,
    readonly directory?: string,
    readonly embargo?: FileEmbargo,
    readonly tabularData?: FileTabularData,
    readonly description?: string
  ) {}

  getLink(): string {
    return `/file?id=${this.id}&version=${this.version.toString()}`
  }
}
