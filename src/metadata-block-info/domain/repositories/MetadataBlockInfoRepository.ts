import { MetadataBlockInfo, MetadataBlockInfo2 } from '../models/MetadataBlockInfo'

export interface MetadataBlockInfoRepository {
  getByName: (name: string) => Promise<MetadataBlockInfo | undefined>
  getByColecctionId: (collectionId: string, create: boolean) => Promise<MetadataBlockInfo2[]>
}
