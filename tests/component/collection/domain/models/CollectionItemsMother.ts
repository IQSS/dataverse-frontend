import {
  CollectionItem,
  CollectionItemsFacet
} from '@/collection/domain/models/CollectionItemSubset'
import { FileItemTypePreviewMother } from '../../../files/domain/models/FileItemTypePreviewMother'
import { CollectionItemTypePreviewMother } from './CollectionItemTypePreviewMother'
import { DatasetItemTypePreviewMother } from '../../../dataset/domain/models/DatasetItemTypePreviewMother'

interface CreateItemsProps {
  numberOfCollections?: number
  numberOfDatasets?: number
  numberOfFiles?: number
}

export class CollectionItemsMother {
  static createItems({
    numberOfCollections = 1,
    numberOfDatasets = 1,
    numberOfFiles = 1
  }: CreateItemsProps): CollectionItem[] {
    const collections = CollectionItemTypePreviewMother.createMany(numberOfCollections)
    const datasets = DatasetItemTypePreviewMother.createMany(numberOfDatasets)
    const files = FileItemTypePreviewMother.createMany(numberOfFiles)

    return [...collections, ...datasets, ...files]
  }

  static createItemsFacets(): CollectionItemsFacet[] {
    return [
      {
        name: 'dvCategory',
        friendlyName: 'Dataverse Category',
        labels: [
          {
            name: 'Department',
            count: 1
          },
          {
            name: 'Journal',
            count: 1
          },
          {
            name: 'Laboratory',
            count: 1
          }
        ]
      },
      {
        name: 'authorName_ss',
        friendlyName: 'Author Name',
        labels: [
          {
            name: 'Admin, Dataverse',
            count: 4
          }
        ]
      }
    ]
  }
}
