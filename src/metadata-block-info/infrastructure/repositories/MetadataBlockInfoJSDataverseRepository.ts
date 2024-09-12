import { MetadataBlockInfoRepository } from '../../domain/repositories/MetadataBlockInfoRepository'
import {
  MetadataBlockInfoDisplayFormat,
  MetadataBlockInfo,
  MetadataField
} from '../../domain/models/MetadataBlockInfo'
import {
  getMetadataBlockByName,
  getCollectionMetadataBlocks,
  getAllMetadataBlocks,
  getAllFacetableMetadataFields as jsGetAllFacetableMetadataFields,
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

  getAll(): Promise<MetadataBlockInfo[]> {
    return getAllMetadataBlocks
      .execute()
      .then((jsMetadataBlockInfo: JSMetadataBlockInfo[]) => {
        return jsMetadataBlockInfo
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getByCollectionId(collectionIdOrAlias: number | string): Promise<MetadataBlockInfo[]> {
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

  getAllFacetableMetadataFields(): Promise<MetadataField[]> {
    return jsGetAllFacetableMetadataFields
      .execute()
      .then((metadataFields: MetadataField[]) => metadataFields)
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }
}
