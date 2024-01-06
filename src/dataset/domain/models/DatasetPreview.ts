import { DatasetLabel, DatasetVersion, Dataset } from './Dataset'

export class DatasetPreview {
  constructor(
    public persistentId: string,
    public title: string,
    public version: DatasetVersion,
    public citation: string,
    public labels: DatasetLabel[],
    public isDeaccessioned: boolean,
    public releaseOrCreateDate: Date,
    public description: string,
    public thumbnail?: string
  ) {
    this.labels = Dataset.withStatusLabel(version.publishingStatus, version.isInReview)
  }

  get abbreviatedDescription(): string {
    if (this.description.length > 280) {
      return `${this.description.substring(0, 280)}...`
    }
    return this.description
  }
}
