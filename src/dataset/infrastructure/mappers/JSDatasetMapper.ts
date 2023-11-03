import {
  Dataset as JSDataset,
  DatasetMetadataBlock as JSDatasetMetadataBlock,
  DatasetMetadataBlocks as JSDatasetMetadataBlocks,
  DatasetMetadataFields as JSDatasetMetadataFields,
  DatasetVersionInfo as JSDatasetVersionInfo,
  DatasetUserPermissions as JSDatasetPermissions
} from '@iqss/dataverse-client-javascript'
import { DatasetVersionState as JSDatasetVersionState } from '@iqss/dataverse-client-javascript/dist/datasets/domain/models/Dataset'
import {
  Dataset,
  DatasetPublishingStatus,
  DatasetMetadataBlock,
  DatasetMetadataBlocks,
  DatasetMetadataFields,
  DatasetVersion,
  MetadataBlockName,
  DatasetPermissions,
  PrivateUrl
} from '../../domain/models/Dataset'

export class JSDatasetMapper {
  static toDataset(
    jsDataset: JSDataset,
    citation: string,
    summaryFieldsNames: string[],
    jsDatasetPermissions: JSDatasetPermissions,
    requestedVersion?: string,
    privateUrl?: PrivateUrl
  ): Dataset {
    return new Dataset.Builder(
      jsDataset.persistentId,
      JSDatasetMapper.toVersion(jsDataset.versionId, jsDataset.versionInfo, requestedVersion),
      citation,
      JSDatasetMapper.toSummaryFields(jsDataset.metadataBlocks, summaryFieldsNames),
      jsDataset.license,
      JSDatasetMapper.toMetadataBlocks(
        jsDataset.metadataBlocks,
        jsDataset.alternativePersistentId,
        jsDataset.publicationDate,
        jsDataset.citationDate
      ),
      JSDatasetMapper.toDatasetPermissions(jsDatasetPermissions),
      [], // TODO Connect with dataset locks
      true, // TODO Connect with dataset hasValidTermsOfAccess
      true, // TODO Connect with dataset isValid
      jsDataset.versionInfo.releaseTime !== undefined &&
        !isNaN(jsDataset.versionInfo.releaseTime.getTime()), // TODO Connect with dataset isReleased,
      undefined, // TODO: get dataset thumbnail from Dataverse https://github.com/IQSS/dataverse-frontend/issues/203
      privateUrl
    ).build()
  }

  static toVersion(
    jDatasetVersionId: number,
    jsDatasetVersionInfo: JSDatasetVersionInfo,
    requestedVersion?: string
  ): DatasetVersion {
    return new DatasetVersion(
      jDatasetVersionId,
      JSDatasetMapper.toStatus(jsDatasetVersionInfo.state),
      true, // TODO Connect with dataset version isLatest
      false, // TODO Connect with dataset version isInReview
      JSDatasetMapper.toStatus(jsDatasetVersionInfo.state), // TODO Connect with dataset version latestVersionState
      jsDatasetVersionInfo.majorNumber,
      jsDatasetVersionInfo.minorNumber,
      requestedVersion
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

    if (citationDate && citationDate !== publicationDate) {
      extraFields.citationDate = citationDate
    }

    return extraFields
  }

  static toDatasetPermissions(jsDatasetPermissions: JSDatasetPermissions): DatasetPermissions {
    return {
      canDownloadFiles: true,
      canUpdateDataset: jsDatasetPermissions.canEditDataset,
      canPublishDataset: jsDatasetPermissions.canPublishDataset,
      canManageDatasetPermissions: jsDatasetPermissions.canManageDatasetPermissions,
      canManageFilesPermissions: true,
      canDeleteDataset: jsDatasetPermissions.canManageDatasetPermissions
    }
  }
}
