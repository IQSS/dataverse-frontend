import { CollectionItemType } from '../../../collection/domain/models/CollectionItemType'
import { PublicationStatus } from '../../../shared/core/domain/models/PublicationStatus'
import { DatasetVersion } from './Dataset'

// TODO:ME A class is not needed, we can change to an interface, we can ellipse the text with CSS as done in CollectionCard and FileCard

export interface DatasetPreview {
  type: CollectionItemType.DATASET
  persistentId: string
  version: DatasetVersion
  releaseOrCreateDate: Date
  description: string
  thumbnail?: string
  publicationStatuses: PublicationStatus[]
  parentCollectionName: string
  parentCollectionAlias: string
}

/*
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
  */
