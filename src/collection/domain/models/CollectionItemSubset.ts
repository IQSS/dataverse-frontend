import { CollectionItemTypePreview } from './CollectionItemTypePreview'
import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { FileItemTypePreview } from '../../../files/domain/models/FileItemTypePreview'

export interface CollectionItemSubset {
  items: CollectionItem[]
  totalItemCount: number
}

export type CollectionItem = CollectionItemTypePreview | DatasetPreview | FileItemTypePreview
