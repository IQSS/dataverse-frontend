import { MetadataField } from '../models/MetadataBlockInfo'
import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'

export async function getAllFacetableMetadataFields(
  metadataBlockInfoRepository: MetadataBlockInfoRepository
): Promise<MetadataField[]> {
  return metadataBlockInfoRepository.getAllFacetableMetadataFields().catch((error: Error) => {
    throw new Error(error.message)
  })
}
