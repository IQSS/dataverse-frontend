import { CollectionItem } from '@/collection/domain/models/CollectionItemSubset'
import { FileItemTypePreviewMother } from '../../../files/domain/models/FileItemTypePreviewMother'
import { CollectionItemTypePreviewMother } from './CollectionItemTypePreviewMother'
import { DatasetPreviewMother } from '../../../dataset/domain/models/DatasetPreviewMother'

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
    const datasets = DatasetPreviewMother.createMany(numberOfDatasets)
    const files = FileItemTypePreviewMother.createMany(numberOfFiles)

    return [...collections, ...datasets, ...files]
  }
}
