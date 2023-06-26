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

export class File {
  constructor(
    readonly name: string,
    readonly access: FileAccess,
    readonly link: string,
    readonly type: string,
    readonly size: FileSize,
    readonly publicationDate: string,
    readonly downloads: number,
    readonly checksum: string,
    readonly thumbnail?: string
  ) {}
}
