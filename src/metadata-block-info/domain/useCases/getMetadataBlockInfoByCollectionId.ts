import { MetadataBlockInfo2 } from '../models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'

export async function getMetadataBlockInfoByCollectionId(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  collectionId: string,
  onlyDisplayedOnCreate: boolean
): Promise<MetadataBlockInfo2[]> {
  return metadataBlockInfoRepository
    .getByColecctionId(collectionId, onlyDisplayedOnCreate)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
