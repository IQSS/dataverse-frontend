import {
  DatasetLabel,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetPublishingStatus,
  DatasetVersion
} from './Dataset'

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
    this.withLabels()
  }

  get abbreviatedDescription(): string {
    if (this.description.length > 280) {
      return `${this.description.substring(0, 280)}...`
    }
    return this.description
  }

  withLabels() {
    this.withStatusLabel()
    this.withVersionLabel()
  }

  private withStatusLabel(): void {
    if (this.version.publishingStatus === DatasetPublishingStatus.DRAFT) {
      this.labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.DRAFT)
      )
    }
    const isReleased = this.version.publishingStatus === DatasetPublishingStatus.RELEASED
    if (!isReleased) {
      this.labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.WARNING, DatasetLabelValue.UNPUBLISHED)
      )
    }

    if (this.version.publishingStatus === DatasetPublishingStatus.DEACCESSIONED) {
      this.labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.DANGER, DatasetLabelValue.DEACCESSIONED)
      )
    }

    if (this.version.publishingStatus === DatasetPublishingStatus.EMBARGOED) {
      this.labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.DATASET, DatasetLabelValue.EMBARGOED)
      )
    }

    if (this.version.isInReview) {
      this.labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.SUCCESS, DatasetLabelValue.IN_REVIEW)
      )
    }
  }

  private withVersionLabel(): void {
    if (this.version.publishingStatus === DatasetPublishingStatus.RELEASED) {
      this.labels.push(
        new DatasetLabel(DatasetLabelSemanticMeaning.FILE, `Version ${this.version.toString()}`)
      )
    }
  }
}
