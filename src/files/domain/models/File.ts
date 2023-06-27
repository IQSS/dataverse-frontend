export class FileSize {
  constructor(readonly value: number, readonly unit: string) {}

  toString(): string {
    return `${this.value} ${this.unit}`
  }
}

export interface FileAccess {
  restricted: boolean
  canDownload: boolean
}

export class FileVersion {
  constructor(public readonly majorNumber: number, public readonly minorNumber: number) {}

  toString(): string {
    return `${this.majorNumber}.${this.minorNumber}`
  }
}

export class File {
  constructor(
    readonly id: string,
    readonly version: FileVersion,
    readonly name: string,
    readonly access: FileAccess,
    readonly type: string,
    readonly size: FileSize,
    readonly publicationDate: string,
    readonly downloads: number,
    readonly checksum: string,
    readonly thumbnail?: string
  ) {}

  getLink(): string {
    return `/file?id=${this.id}&version=${this.version.toString()}`
  }
}
