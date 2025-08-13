import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../models/MetadataBlockInfo'

export async function getAllMetadataBlocksInfo(
  metadataBlockInfoRepository: MetadataBlockInfoRepository
): Promise<MetadataBlockInfo[]> {
  return metadataBlockInfoRepository.getAll().catch((error: Error) => {
    throw new Error(error.message)
  })
}
