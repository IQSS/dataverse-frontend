import { CollectionItemTypePreview } from './CollectionItemTypePreview'
import { DatasetItemTypePreview } from '../../../dataset/domain/models/DatasetItemTypePreview'
import { FileItemTypePreview } from '../../../files/domain/models/FileItemTypePreview'

export interface CollectionItemSubset {
  items: CollectionItem[]
  totalItemCount: number
}

export type CollectionItem =
  | CollectionItemTypePreview
  | DatasetItemTypePreview
  | FileItemTypePreview
