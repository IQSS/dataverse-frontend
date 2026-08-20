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

  getByCollectionId(
    collectionIdOrAlias: number | string,
    onlyDisplayedOnCreate?: boolean,
    datasetType?: string
  ): Promise<MetadataBlockInfo[]> {
    return getCollectionMetadataBlocks
      .execute(collectionIdOrAlias, onlyDisplayedOnCreate, datasetType)
      .then((metadataBlocks: MetadataBlockInfo[]) => {
        return metadataBlocks
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getDisplayedOnCreateByCollectionId(
    collectionIdOrAlias: number | string,
    datasetType?: string
  ): Promise<MetadataBlockInfo[]> {
    return getCollectionMetadataBlocks
      .execute(collectionIdOrAlias, true, datasetType)
      .then((metadataBlocks: MetadataBlockInfo[]) => {
        const metadataBlocksWithFields: MetadataBlockInfo[] = []
        metadataBlocks.forEach((block) => {
          const numFields = Object.keys(block.metadataFields).length
          // numFields can be zero if you pass a datasetType that's linked to
          // a metadata block that doesn't have any fields set to displayOnCreate.
          // See https://github.com/IQSS/dataverse/blob/v6.7.1/src/test/java/edu/harvard/iq/dataverse/api/DatasetTypesIT.java#L512
          if (numFields > 0) {
            metadataBlocksWithFields.push(block)
          }
        })
        return metadataBlocksWithFields
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
