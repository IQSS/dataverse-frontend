import { DatasetPreview } from '../../../dataset/domain/models/DatasetPreview'
import { FilePreview } from '../../../files/domain/models/FilePreview'
import { CollectionPreview } from './CollectionPreview'

export interface CollectionItemSubset {
  items: CollectionItem[]
  totalItemCount: number
}

export type CollectionItem = CollectionPreview | DatasetPreview | FilePreview
