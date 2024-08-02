import { MetadataBlockInfoRepository } from '../../domain/repositories/MetadataBlockInfoRepository'
import {
  MetadataBlockInfoDisplayFormat,
  MetadataBlockInfo
} from '../../domain/models/MetadataBlockInfo'
import {
  getMetadataBlockByName,
  getCollectionMetadataBlocks,
  MetadataBlock as JSMetadataBlockInfo,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { JSMetadataBlockInfoMapper } from '../mappers/JSMetadataBlockInfoMapper'

export class MetadataBlockInfoJSDataverseRepository implements MetadataBlockInfoRepository {
  getByName(name: string): Promise<MetadataBlockInfoDisplayFormat | undefined> {
    return getMetadataBlockByName
      .execute(name)
      .then((jsMetadataBlockInfo: JSMetadataBlockInfo) =>
        JSMetadataBlockInfoMapper.toMetadataBlockInfo(jsMetadataBlockInfo)
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  // TODO: This will be replaced to a new use case that will return all metadata blocks info
  getAllTemporal(names: string[]): Promise<MetadataBlockInfo[]> {
    const blockPromises = names.map((name) => getMetadataBlockByName.execute(name))

    return Promise.all(blockPromises)
      .then((jsMetadataBlockInfo: JSMetadataBlockInfo[]) => {
        return jsMetadataBlockInfo
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getByColecctionId(collectionIdOrAlias: number | string): Promise<MetadataBlockInfo[]> {
    return getCollectionMetadataBlocks
      .execute(collectionIdOrAlias)
      .then((metadataBlocks: MetadataBlockInfo[]) => {
        return metadataBlocks
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getDisplayedOnCreateByCollectionId(
    collectionIdOrAlias: number | string
  ): Promise<MetadataBlockInfo[]> {
    return getCollectionMetadataBlocks
      .execute(collectionIdOrAlias, true)
      .then((metadataBlocks: MetadataBlockInfo[]) => {
        return metadataBlocks
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }
}
