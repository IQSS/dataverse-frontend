import {
  Dataset as JSDataset,
  DatasetLock as JSDatasetLock,
  DatasetMetadataBlock as JSDatasetMetadataBlock,
  DatasetMetadataBlocks as JSDatasetMetadataBlocks,
  DatasetMetadataFields as JSDatasetMetadataFields,
  DatasetUserPermissions as JSDatasetPermissions,
  DatasetVersionInfo as JSDatasetVersionInfo
} from '@iqss/dataverse-client-javascript'
import {
  Dataset,
  DatasetDownloadUrls,
  DatasetLock,
  DatasetLockReason,
  DatasetMetadataBlock,
  DatasetMetadataBlocks,
  DatasetMetadataFields,
  DatasetPermissions,
  DatasetVersion,
  MetadataBlockName,
  PrivateUrl
} from '../../domain/models/Dataset'
import { FileDownloadMode, FileDownloadSize, FileSizeUnit } from '../../../files/domain/models/File'
import { JSDatasetVersionMapper } from './JSDatasetVersionMapper'

export class JSDatasetMapper {
  static toDataset(
    jsDataset: JSDataset,
    citation: string,
    summaryFieldsNames: string[],
    jsDatasetPermissions: JSDatasetPermissions,
    jsDatasetLocks: JSDatasetLock[],
    jsDatasetFilesTotalOriginalDownloadSize: number,
    jsDatasetFilesTotalArchivalDownloadSize: number,
    requestedVersion?: string,
    privateUrl?: PrivateUrl
  ): Dataset {
    const version = JSDatasetVersionMapper.toDatasetVersion(
      jsDataset.versionId,
      jsDataset.versionInfo,
      requestedVersion
    )
    return new Dataset.Builder(
      jsDataset.persistentId,
      version,
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
      JSDatasetMapper.toLocks(jsDatasetLocks),
      true, // TODO Connect with dataset hasValidTermsOfAccess
      true, // TODO Connect with dataset hasOneTabularFileAtLeast
      true, // TODO Connect with dataset isValid
      JSDatasetMapper.toIsReleased(jsDataset.versionInfo),
      JSDatasetMapper.toDownloadUrls(jsDataset.persistentId, version),
      JSDatasetMapper.toFileDownloadSizes(
        jsDatasetFilesTotalOriginalDownloadSize,
        jsDatasetFilesTotalArchivalDownloadSize
      ),
      undefined, // TODO: get dataset thumbnail from Dataverse https://github.com/IQSS/dataverse-frontend/issues/203
      privateUrl
    ).build()
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

  static toIsReleased(jsDatasetVersionInfo: JSDatasetVersionInfo): boolean {
    return (
      jsDatasetVersionInfo.releaseTime !== undefined &&
      !isNaN(jsDatasetVersionInfo.releaseTime.getTime())
    )
  }

  static toDatasetPermissions(jsDatasetPermissions: JSDatasetPermissions): DatasetPermissions {
    return {
      canDownloadFiles: true, // TODO: connect with js-dataverse
      canUpdateDataset: jsDatasetPermissions.canEditDataset,
      canPublishDataset: jsDatasetPermissions.canPublishDataset,
      canManageDatasetPermissions: jsDatasetPermissions.canManageDatasetPermissions,
      canManageFilesPermissions: true, // TODO: connect with js-dataverse DatasetPermissions.canManageFilesPermissions
      canDeleteDataset: jsDatasetPermissions.canManageDatasetPermissions
    }
  }

  static toLocks(jsDatasetLocks: JSDatasetLock[]): DatasetLock[] {
    return jsDatasetLocks.map((jsDatasetLock) => {
      return {
        userPersistentId: jsDatasetLock.userId,
        reason: jsDatasetLock.lockType as unknown as DatasetLockReason
      }
    })
  }

  static toDownloadUrls(
    jsDatasetPersistentId: string,
    version: DatasetVersion
  ): DatasetDownloadUrls {
    return {
      original: `/api/access/dataset/:persistentId/versions/${version.toString()}?persistentId=${jsDatasetPersistentId}&format=original`,
      archival: `/api/access/dataset/:persistentId/versions/${version.toString()}?persistentId=${jsDatasetPersistentId}`
    }
  }

  static toFileDownloadSizes(
    jsDatasetFilesTotalOriginalDownloadSize: number,
    jsDatasetFilesTotalArchivalDownloadSize: number
  ): FileDownloadSize[] {
    return [
      new FileDownloadSize(
        jsDatasetFilesTotalOriginalDownloadSize,
        FileSizeUnit.BYTES,
        FileDownloadMode.ORIGINAL
      ),
      new FileDownloadSize(
        jsDatasetFilesTotalArchivalDownloadSize,
        FileSizeUnit.BYTES,
        FileDownloadMode.ARCHIVAL
      )
    ]
  }
}
