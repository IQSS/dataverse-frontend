import { MetadataBlockInfoRepository } from '../../domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo, MetadataBlockInfo2 } from '../../domain/models/MetadataBlockInfo'
import {
  getMetadataBlockByName,
  MetadataBlock as JSMetadataBlockInfo,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { JSMetadataBlockInfoMapper } from '../mappers/JSMetadataBlockInfoMapper'
import { metadataBlocksInfoByCollectionIdResponse } from '../../../sections/create-dataset/mocks/metadataBlocksInfoByCollectionIdResponse'

export class MetadataBlockInfoJSDataverseRepository implements MetadataBlockInfoRepository {
  getByName(name: string): Promise<MetadataBlockInfo | undefined> {
    return getMetadataBlockByName
      .execute(name)
      .then((jsMetadataBlockInfo: JSMetadataBlockInfo) =>
        JSMetadataBlockInfoMapper.toMetadataBlockInfo(jsMetadataBlockInfo)
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getByColecctionId(_collectionId: string, _create: boolean): Promise<MetadataBlockInfo2[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(metadataBlocksInfoByCollectionIdResponse)
      }, 1_000)
    })
  }
}
