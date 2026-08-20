import { MetadataBlockInfo } from '../models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'

export async function getMetadataBlockInfoByCollectionId(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  collectionId: number | string,
  onlyDisplayedOnCreate?: boolean,
  datasetType?: string
): Promise<MetadataBlockInfo[]> {
  return metadataBlockInfoRepository
    .getByCollectionId(collectionId, onlyDisplayedOnCreate, datasetType)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
