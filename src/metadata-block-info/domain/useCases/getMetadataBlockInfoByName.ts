import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../models/MetadataBlockInfo'

export async function getMetadataBlockInfoByName(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  name: string
): Promise<MetadataBlockInfo | undefined> {
  return metadataBlockInfoRepository.getByName(name).catch((error: Error) => {
    throw new Error(error.message)
  })
}
