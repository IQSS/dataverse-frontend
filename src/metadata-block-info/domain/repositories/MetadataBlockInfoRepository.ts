import { MetadataBlockInfo, MetadataBlockInfo2 } from '../models/MetadataBlockInfo'

export interface MetadataBlockInfoRepository {
  getByName: (name: string) => Promise<MetadataBlockInfo | undefined>
  getByColecctionId: (
    collectionId: number | string,
    onlyDisplayedOnCreate?: boolean
  ) => Promise<MetadataBlockInfo2[]>
}
