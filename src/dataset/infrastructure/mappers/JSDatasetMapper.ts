import {
  Dataset as JSDataset,
  DatasetMetadataBlocks as JSDatasetMetadataBlocks,
  DatasetMetadataBlock as JSDatasetMetadataBlock,
  DatasetMetadataFields as JSDatasetMetadataFields,
  DatasetVersionInfo as JSDatasetVersionInfo
} from '@iqss/dataverse-client-javascript'
import { DatasetVersionState as JSDatasetVersionState } from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import {
  Dataset,
  DatasetPublishingStatus,
  MetadataBlockName,
  DatasetMetadataBlock,
  DatasetVersion,
  DatasetMetadataFields,
  DatasetMetadataBlocks
} from '../../domain/models/Dataset'

export class JSDatasetMapper {
  static toDataset(jsDataset: JSDataset, citation: string, summaryFieldsNames: string[]): Dataset {
    return new Dataset.Builder(
      jsDataset.persistentId,
      JSDatasetMapper.toVersion(jsDataset.versionId, jsDataset.versionInfo),
      citation,
      JSDatasetMapper.toSummaryFields(jsDataset.metadataBlocks, summaryFieldsNames),
      jsDataset.license,
      JSDatasetMapper.toMetadataBlocks(jsDataset.metadataBlocks) // TODO Add alternativePersistentId, publicationDate, citationDate
    ).build()
  }

  static toVersion(
    jDatasetVersionId: number,
    jsDatasetVersionInfo: JSDatasetVersionInfo
  ): DatasetVersion {
    return new DatasetVersion(
      jDatasetVersionId,
      JSDatasetMapper.toStatus(jsDatasetVersionInfo.state),
      jsDatasetVersionInfo.majorNumber,
      jsDatasetVersionInfo.minorNumber
    )
  }

  static toStatus(jsDatasetVersionState: JSDatasetVersionState): DatasetPublishingStatus {
    switch (jsDatasetVersionState) {
      case JSDatasetVersionState.DRAFT:
        return DatasetPublishingStatus.DRAFT
      case JSDatasetVersionState.DEACCESSIONED:
        return DatasetPublishingStatus.DEACCESSIONED
      case JSDatasetVersionState.RELEASED:
        return DatasetPublishingStatus.RELEASED
      default:
        return DatasetPublishingStatus.DRAFT
    }
  }

  static toSummaryFields(
    jsDatasetMetadataBlocks: JSDatasetMetadataBlocks,
    summaryFieldsNames: string[]
  ): DatasetMetadataBlock[] {
    return jsDatasetMetadataBlocks.map((jsDatasetMetadataBlock) => {
      const getSummaryFields = (metadataFields: JSDatasetMetadataFields): DatasetMetadataFields => {
        return Object.keys(metadataFields).reduce((acc, metadataFieldName) => {
          if (summaryFieldsNames.includes(metadataFieldName)) {
            return {
              ...acc,
              [metadataFieldName]: metadataFields[metadataFieldName]
            }
          }
          return acc
        }, {})
      }

      return {
        name: JSDatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name),
        fields: getSummaryFields(jsDatasetMetadataBlock.fields)
      }
    })
  }

  static toMetadataBlocks(
    jsDatasetMetadataBlocks: JSDatasetMetadataBlocks,
    alternativePersistentId?: string,
    publicationDate?: string,
    citationDate?: string
  ): DatasetMetadataBlocks {
    return jsDatasetMetadataBlocks.map((jsDatasetMetadataBlock) => {
      return {
        name: JSDatasetMapper.toMetadataBlockName(jsDatasetMetadataBlock.name),
        fields: JSDatasetMapper.toMetadataFields(
          jsDatasetMetadataBlock,
          alternativePersistentId,
          publicationDate,
          citationDate
        )
      }
    }) as DatasetMetadataBlocks
  }

  static toMetadataBlockName(jsDatasetMetadataBlockName: string): MetadataBlockName {
    const metadataBlockNameKey = Object.values(MetadataBlockName).find((metadataBlockNameKey) => {
      return metadataBlockNameKey === jsDatasetMetadataBlockName
    })

    if (metadataBlockNameKey === undefined) {
      throw new Error('Incorrect Metadata block name key')
    }

    return metadataBlockNameKey
  }

  static toMetadataFields(
    jsDatasetMetadataBlock: JSDatasetMetadataBlock,
    alternativePersistentId?: string,
    publicationDate?: string,
    citationDate?: string
  ): DatasetMetadataFields {
    if (jsDatasetMetadataBlock.name === MetadataBlockName.CITATION) {
      return {
        ...JSDatasetMapper.getExtraFieldsForCitationMetadata(
          publicationDate,
          alternativePersistentId,
          citationDate
        ),
        ...jsDatasetMetadataBlock.fields
      }
    }

    return jsDatasetMetadataBlock.fields
  }

  static getExtraFieldsForCitationMetadata(
    publicationDate?: string,
    alternativePersistentId?: string,
    citationDate?: string
  ) {
    const extraFields: {
      alternativePersistentId?: string
      publicationDate?: string
      citationDate?: string
    } = {}

    if (alternativePersistentId) {
      extraFields.alternativePersistentId = alternativePersistentId
    }

    if (publicationDate) {
      extraFields.publicationDate = publicationDate
    }

    if (publicationDate && citationDate !== publicationDate) {
      extraFields.citationDate = citationDate
    }

    return extraFields
  }
}
