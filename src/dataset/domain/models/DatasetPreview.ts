import { DatasetVersion } from './Dataset'

export class DatasetPreview {
  constructor(
    public persistentId: string,
    public version: DatasetVersion,
    public releaseOrCreateDate: Date,
    public description: string,
    public thumbnail?: string
  ) {}

  get abbreviatedDescription(): string {
    if (this.description.length > 280) {
      return `${this.description.substring(0, 280)}...`
    }
    return this.description
  }
}
