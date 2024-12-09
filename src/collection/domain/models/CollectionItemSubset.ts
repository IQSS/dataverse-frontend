import { CollectionItemTypePreview } from './CollectionItemTypePreview'
import { DatasetItemTypePreview } from '../../../dataset/domain/models/DatasetItemTypePreview'
import { FileItemTypePreview } from '../../../files/domain/models/FileItemTypePreview'

export interface CollectionItemSubset {
  items: CollectionItem[]
  facets: CollectionItemsFacet[]
  totalItemCount: number
}

export type CollectionItem =
  | CollectionItemTypePreview
  | DatasetItemTypePreview
  | FileItemTypePreview

export interface CollectionItemsFacet {
  [key: string]: CollectionItemsFacetValue
}

interface CollectionItemsFacetValue {
  friendly: string
  labels: CollectionItemsFacetLabel[]
}

interface CollectionItemsFacetLabel {
  name: string
  count: number
}
