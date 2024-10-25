import {
  Dataset as JSDataset,
  DatasetLock as JSDatasetLock,
  DatasetMetadataBlock as JSDatasetMetadataBlock,
  DatasetMetadataBlocks as JSDatasetMetadataBlocks,
  DatasetMetadataFields as JSDatasetMetadataFields,
  DatasetUserPermissions as JSDatasetPermissions,
  DvObjectOwnerNode as JSUpwardHierarchyNode
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
import {
  FileDownloadMode,
  FileDownloadSize,
  FileSizeUnit
} from '../../../files/domain/models/FileMetadata'
import { JSDatasetVersionMapper } from './JSDatasetVersionMapper'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'
import { JSUpwardHierarchyNodeMapper } from '../../../shared/hierarchy/infrastructure/mappers/JSUpwardHierarchyNodeMapper'

export class JSDatasetMapper {
  static toDataset(
    jsDataset: JSDataset,
    jsDatasetCitation: string,
    jsDatasetSummaryFieldsNames: string[],
    jsDatasetPermissions: JSDatasetPermissions,
    jsDatasetLocks: JSDatasetLock[],
    jsDatasetFilesTotalOriginalDownloadSize: number,
    jsDatasetFilesTotalArchivalDownloadSize: number,
    requestedVersion?: string,
    privateUrl?: PrivateUrl,
    latestPublishedVersionMajorNumber?: number,
    latestPublishedVersionMinorNumber?: number
  ): Dataset {
    const version = JSDatasetVersionMapper.toVersion(
      jsDataset.versionId,
      jsDataset.versionInfo,
      JSDatasetMapper.toDatasetTitle(jsDataset.metadataBlocks),
      jsDatasetCitation,
      jsDataset.publicationDate
    )
    return new Dataset.Builder(
      jsDataset.persistentId,
      version,
      JSDatasetMapper.toSummaryFields(jsDataset.metadataBlocks, jsDatasetSummaryFieldsNames),
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
      JSDatasetMapper.toDownloadUrls(jsDataset.persistentId, version),
      JSDatasetMapper.toFileDownloadSizes(
        jsDatasetFilesTotalOriginalDownloadSize,
        jsDatasetFilesTotalArchivalDownloadSize
      ),
      JSDatasetMapper.toHierarchy(
        jsDataset.id,
        jsDataset.persistentId,
        version,
        jsDataset.isPartOf
      ),
      undefined, // TODO: get dataset thumbnail from js-dataverse https://github.com/IQSS/dataverse-frontend/issues/203
      privateUrl,
      requestedVersion,
      JSDatasetMapper.toNextMajorVersion(latestPublishedVersionMajorNumber),
      JSDatasetMapper.toNextMinorVersion(
        latestPublishedVersionMajorNumber,
        latestPublishedVersionMinorNumber
      )
    ).build()
  }

  static toNextMajorVersion(
    latestPublishedVersionMajorNumber: number | undefined
  ): string | undefined {
    if (latestPublishedVersionMajorNumber === undefined) {
      return undefined
    }
    const nextMajorVersion = (latestPublishedVersionMajorNumber + 1).toString() + '.0'
    return nextMajorVersion
  }
  static toNextMinorVersion(
    latestPublishedVersionMajorNumber: number | undefined,
    latestPublishedVersionMinorNumber: number | undefined
  ): string | undefined {
    if (
      latestPublishedVersionMajorNumber === undefined ||
      latestPublishedVersionMinorNumber === undefined
    ) {
      return undefined
    }
    const nextMinorVersion = `${latestPublishedVersionMajorNumber}.${
      latestPublishedVersionMinorNumber + 1
    }`
    return nextMinorVersion
  }

  static toDatasetTitle(jsDatasetMetadataBlocks: JSDatasetMetadataBlocks): string {
    return jsDatasetMetadataBlocks[0].fields.title
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

  static toDownloadUrls(
    jsDatasetPersistentId: string,
    version: DatasetVersion
  ): DatasetDownloadUrls {
    return {
      original: `/api/access/dataset/:persistentId/versions/${version.number.toString()}?persistentId=${jsDatasetPersistentId}&format=original`,
      archival: `/api/access/dataset/:persistentId/versions/${version.number.toString()}?persistentId=${jsDatasetPersistentId}`
    }
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

  static toHierarchy(
    id: number,
    persistentId: string,
    version: DatasetVersion,
    jsUpwardHierarchyNode: JSUpwardHierarchyNode
  ): UpwardHierarchyNode {
    return new UpwardHierarchyNode(
      version.title,
      DvObjectType.DATASET,
      id.toString(),
      persistentId,
      version.number.toString(),
      undefined,
      JSUpwardHierarchyNodeMapper.toUpwardHierarchyNode(jsUpwardHierarchyNode)
    )
  }
}
