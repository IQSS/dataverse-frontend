import { DatasetLabel, DatasetVersion, Dataset } from './Dataset'

export class DatasetPreview {
  public labels: DatasetLabel[]

  constructor(
    public persistentId: string,
    public title: string,
    public version: DatasetVersion,
    public isReleased: boolean,
    public citation: string,
    public isDeaccessioned: boolean,
    public releaseOrCreateDate: Date,
    public description: string,
    public thumbnail?: string
  ) {
    this.labels = Dataset.createStatusLabels(
      version.publishingStatus,
      version.isInReview,
      this.isReleased
    )
  }

  get abbreviatedDescription(): string {
    if (this.description.length > 280) {
      return `${this.description.substring(0, 280)}...`
    }
    return this.description
  }
}
