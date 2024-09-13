import { DatasetVersion } from './Dataset'

// TODO:ME Once 181 is merged, update interface
// TODO:ME A class is not needed, we can change to an interface, we can ellipse the text with CSS as done in CollectionCard and FileCard

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
