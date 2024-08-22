import { MetadataBlockInfo } from '../models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'

export async function getMetadataBlockInfoByCollectionId(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  collectionId: number | string
): Promise<MetadataBlockInfo[]> {
  return metadataBlockInfoRepository.getByCollectionId(collectionId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
