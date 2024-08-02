import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../models/MetadataBlockInfo'

export async function getAllMetadataBlocksInfoTemporal(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  names: string[]
): Promise<MetadataBlockInfo[]> {
  return metadataBlockInfoRepository.getAllTemporal(names).catch((error: Error) => {
    throw new Error(error.message)
  })
}
