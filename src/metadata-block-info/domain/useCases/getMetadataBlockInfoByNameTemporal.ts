import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../models/MetadataBlockInfo'

export async function getMetadataBlockInfoByNameTemporal(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  name: string
): Promise<MetadataBlockInfo> {
  return metadataBlockInfoRepository.getByNameTemporal(name).catch((error: Error) => {
    throw new Error(error.message)
  })
}
