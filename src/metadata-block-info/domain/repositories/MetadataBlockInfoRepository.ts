import { MetadataBlockInfoDisplayFormat, MetadataBlockInfo } from '../models/MetadataBlockInfo'

export interface MetadataBlockInfoRepository {
  getByName: (name: string) => Promise<MetadataBlockInfoDisplayFormat | undefined>
  getByColecctionId: (
    collectionId: number | string,
    onlyDisplayedOnCreate?: boolean
  ) => Promise<MetadataBlockInfo[]>
}
