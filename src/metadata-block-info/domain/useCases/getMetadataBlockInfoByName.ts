import { MetadataBlockInfoRepository } from '../repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoDisplayFormat } from '../models/MetadataBlockInfo'

export async function getMetadataBlockInfoByName(
  metadataBlockInfoRepository: MetadataBlockInfoRepository,
  name: string
): Promise<MetadataBlockInfoDisplayFormat | undefined> {
  return metadataBlockInfoRepository.getByName(name).catch((error: Error) => {
    throw new Error(error.message)
  })
}
