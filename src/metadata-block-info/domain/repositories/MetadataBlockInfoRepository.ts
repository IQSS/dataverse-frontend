import {
  MetadataBlockInfoDisplayFormat,
  MetadataBlockInfo,
  MetadataField
} from '../models/MetadataBlockInfo'

export interface MetadataBlockInfoRepository {
  getByName: (name: string) => Promise<MetadataBlockInfoDisplayFormat | undefined>
  getAll: () => Promise<MetadataBlockInfo[]>
  getDisplayedOnCreateByCollectionId: (
    collectionId: number | string,
    datasetType?: string
  ) => Promise<MetadataBlockInfo[]>
  getByCollectionId: (
    collectionId: number | string,
    onlyDisplayedOnCreate?: boolean,
    datasetType?: string
  ) => Promise<MetadataBlockInfo[]>
  getAllFacetableMetadataFields: () => Promise<MetadataField[]>
}
