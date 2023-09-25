import { MetadataBlockInfoRepository } from '../../domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfo } from '../../domain/models/MetadataBlockInfo'
import {
  getMetadataBlockByName,
  MetadataBlock as JSMetadataBlockInfo
} from '@iqss/dataverse-client-javascript'
import { JSMetadataBlockInfoMapper } from '../mappers/JSMetadataBlockInfoMapper'

export class MetadataBlockInfoJSDataverseRepository implements MetadataBlockInfoRepository {
  getByName(name: string): Promise<MetadataBlockInfo | undefined> {
    return getMetadataBlockByName
      .execute(name)
      .then((jsMetadataBlockInfo: JSMetadataBlockInfo) =>
        JSMetadataBlockInfoMapper.toMetadataBlockInfo(jsMetadataBlockInfo)
      )
  }
}
