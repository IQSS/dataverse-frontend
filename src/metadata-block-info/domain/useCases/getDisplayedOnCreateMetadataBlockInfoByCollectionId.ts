import { MetadataBlockInfo } from '../models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'

export async function getDisplayedOnCreateMetadataBlockInfoByCollectionId(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  collectionId: number | string,
  datasetType?: string
): Promise<MetadataBlockInfo[]> {
  return metadataBlockInfoRepository
    .getDisplayedOnCreateByCollectionId(collectionId, datasetType)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
