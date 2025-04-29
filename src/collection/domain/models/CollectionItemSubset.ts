import { CollectionItemTypePreview } from './CollectionItemTypePreview'
import { DatasetItemTypePreview } from '../../../dataset/domain/models/DatasetItemTypePreview'
import { FileItemTypePreview } from '../../../files/domain/models/FileItemTypePreview'

export interface CollectionItemSubset {
  items: CollectionItem[]
  facets: CollectionItemsFacet[]
  totalItemCount: number
}

export interface MyDataCollectionItemSubset {
  items: CollectionItem[]
  publishingFacet: CollectionItemsFacetLabel[]
  totalItemCount: number
  countPerObjectType: CountPerObjectType
}

export type CollectionItem =
  | CollectionItemTypePreview
  | DatasetItemTypePreview
  | FileItemTypePreview

export interface CollectionItemsFacet {
  name: string
  friendlyName: string
  labels: CollectionItemsFacetLabel[]
}

interface CollectionItemsFacetLabel {
  name: string
  count: number
}
interface CountPerObjectType {
  collections: number
  datasets: number
  files: number
}
