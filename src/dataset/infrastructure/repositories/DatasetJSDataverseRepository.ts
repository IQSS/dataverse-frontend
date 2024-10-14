import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset, DatasetLock, DatasetNonNumericVersion } from '../../domain/models/Dataset'
import {
  createDataset,
  CreatedDatasetIdentifiers as JSDatasetIdentifiers,
  Dataset as JSDataset,
  DatasetLock as JSDatasetLock,
  DatasetPreview as JSDatasetPreview,
  DatasetPreviewSubset,
  DatasetUserPermissions as JSDatasetPermissions,
  DatasetVersionState,
  FileDownloadSizeMode,
  getAllDatasetPreviews,
  getDataset,
  getDatasetCitation,
  getDatasetFilesTotalDownloadSize,
  getDatasetLocks,
  getDatasetSummaryFieldNames,
  getDatasetUserPermissions,
  getPrivateUrlDataset,
  getPrivateUrlDatasetCitation,
  publishDataset,
  ReadError,
  updateDataset,
  VersionUpdateType as JSVersionUpdateType,
  WriteError
} from '@iqss/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'
import { DatasetPaginationInfo } from '../../domain/models/DatasetPaginationInfo'
import { JSDatasetPreviewMapper } from '../mappers/JSDatasetPreviewMapper'
import { DatasetDTO } from '../../domain/useCases/DTOs/DatasetDTO'
import { DatasetDTOMapper } from '../mappers/DatasetDTOMapper'
import { DatasetsWithCount } from '../../domain/models/DatasetsWithCount'
import { VersionUpdateType } from '../../domain/models/VersionUpdateType'
import { ROOT_COLLECTION_ALIAS } from '../../../collection/domain/models/Collection'

const includeDeaccessioned = true
type DatasetDetails = [JSDataset, string[], string, JSDatasetPermissions, JSDatasetLock[]]

interface IDatasetDetails {
  jsDataset: JSDataset
  summaryFieldsNames: string[]
  citation: string
  jsDatasetPermissions: JSDatasetPermissions
  jsDatasetLocks: JSDatasetLock[]
  jsDatasetFilesTotalOriginalDownloadSize: number
  jsDatasetFilesTotalArchivalDownloadSize: number
  latestPublishedVersionMajorNumber?: number
  latestPublishedVersionMinorNumber?: number
}

export class DatasetJSDataverseRepository implements DatasetRepository {
  getAllWithCount(
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ): Promise<DatasetsWithCount> {
    return getAllDatasetPreviews
      .execute(paginationInfo.pageSize, paginationInfo.offset, collectionId)
      .then((subset: DatasetPreviewSubset) => {
        const datasetPreviewsMapped = subset.datasetPreviews.map(
          (datasetPreview: JSDatasetPreview) =>
            JSDatasetPreviewMapper.toDatasetItemTypePreview(datasetPreview)
        )
        return {
          datasetPreviews: datasetPreviewsMapped,
          totalCount: subset.totalDatasetCount
        }
      })
  }
  private async getLatestPublishedVersionNumbers(
    datasetDetails: IDatasetDetails
  ): Promise<IDatasetDetails> {
    await getDataset
      .execute(datasetDetails.jsDataset.persistentId, DatasetNonNumericVersion.LATEST_PUBLISHED)
      .then((latestPublishedDataset) => {
        datasetDetails.latestPublishedVersionMajorNumber =
          latestPublishedDataset.versionInfo.majorNumber
        datasetDetails.latestPublishedVersionMinorNumber =
          latestPublishedDataset.versionInfo.minorNumber
        return datasetDetails
      })

    return datasetDetails
  }

  private async fetchDatasetDetails(
    jsDataset: JSDataset,
    version?: string
  ): Promise<IDatasetDetails> {
    return Promise.all([
      jsDataset,
      getDatasetSummaryFieldNames.execute(),
      getDatasetCitation.execute(jsDataset.id, version, includeDeaccessioned),
      getDatasetUserPermissions.execute(jsDataset.id),
      getDatasetLocks.execute(jsDataset.id)
    ]).then(
      ([
        jsDataset,
        summaryFieldsNames,
        citation,
        jsDatasetPermissions,
        jsDatasetLocks
      ]: DatasetDetails) => {
        return {
          jsDataset,
          summaryFieldsNames,
          citation,
          jsDatasetPermissions,
          jsDatasetLocks,
          jsDatasetFilesTotalOriginalDownloadSize: 0,
          jsDatasetFilesTotalArchivalDownloadSize: 0
        }
      }
    )
  }

  private async fetchDownloadSizes(
    persistentId: string,
    version?: string
  ): Promise<[number, number]> {
    return Promise.all([
      getDatasetFilesTotalDownloadSize.execute(
        persistentId,
        version,
        FileDownloadSizeMode.ORIGINAL,
        undefined,
        includeDeaccessioned
      ),
      getDatasetFilesTotalDownloadSize.execute(
        persistentId,
        version,
        FileDownloadSizeMode.ARCHIVAL,
        undefined,
        includeDeaccessioned
      )
    ])
  }
  getLocks(persistentId: string): Promise<DatasetLock[]> {
    return getDatasetLocks.execute(persistentId).then((jsDatasetLocks) => {
      return JSDatasetMapper.toLocks(jsDatasetLocks)
    })
  }

  getByPersistentId(
    persistentId: string,
    version: string = DatasetNonNumericVersion.LATEST_PUBLISHED,
    requestedVersion?: string
  ): Promise<Dataset | undefined> {
    return getDataset
      .execute(persistentId, version, includeDeaccessioned)
      .then((jsDataset) => this.fetchDatasetDetails(jsDataset, version))
      .then((datasetDetails) => {
        return this.fetchDownloadSizes(persistentId, version).then((downloadSizes) => {
          datasetDetails.jsDatasetFilesTotalOriginalDownloadSize = downloadSizes[0]
          datasetDetails.jsDatasetFilesTotalArchivalDownloadSize = downloadSizes[1]
          return datasetDetails
        })
      })
      .then((datasetDetails) => {
        if (
          datasetDetails.jsDataset.versionInfo.state === DatasetVersionState.DRAFT &&
          datasetDetails.jsDataset.publicationDate !== undefined
        ) {
          // If the dataset is a draft, but has a publication date, then we need the version
          // numbers of the latest published version to show in the "Publish" button
          return this.getLatestPublishedVersionNumbers(datasetDetails)
        } else {
          return datasetDetails
        }
      })
      .then((datasetDetails) => {
        return JSDatasetMapper.toDataset(
          datasetDetails.jsDataset,
          datasetDetails.citation,
          datasetDetails.summaryFieldsNames,
          datasetDetails.jsDatasetPermissions,
          datasetDetails.jsDatasetLocks,
          datasetDetails.jsDatasetFilesTotalOriginalDownloadSize,
          datasetDetails.jsDatasetFilesTotalArchivalDownloadSize,
          requestedVersion,
          undefined,
          datasetDetails.latestPublishedVersionMajorNumber,
          datasetDetails.latestPublishedVersionMinorNumber
        )
      })
      .catch((error: ReadError) => {
        console.error(error)
        if (version === DatasetNonNumericVersion.LATEST_PUBLISHED) {
          throw new Error(`Failed to get dataset by persistent ID: ${error.message}`)
        }
        return this.getByPersistentId(
          persistentId,
          DatasetNonNumericVersion.LATEST_PUBLISHED,
          (requestedVersion = version)
        )
      })
  }
  getByPrivateUrlToken(privateUrlToken: string): Promise<Dataset | undefined> {
    return Promise.all([
      getPrivateUrlDataset.execute(privateUrlToken),
      getDatasetSummaryFieldNames.execute(),
      getPrivateUrlDatasetCitation.execute(privateUrlToken)
    ])
      .then(([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) =>
        JSDatasetMapper.toDataset(
          jsDataset,
          citation,
          summaryFieldsNames,
          {
            canEditDataset: true,
            canPublishDataset: true,
            canManageDatasetPermissions: true,
            canDeleteDatasetDraft: true,
            canViewUnpublishedDataset: true
          }, // TODO Connect with JS dataset permissions for privateUrl when it is available in js-dataverse
          [], // TODO Connect with JS dataset locks for privateUrl when it is available in js-dataverse
          0, // TODO Connect with JS dataset filesTotalDownloadSize for privateUrl when it is available in js-dataverse
          0 // TODO Connect with JS dataset filesTotalDownloadSize for privateUrl when it is available in js-dataverse
        )
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  create(
    dataset: DatasetDTO,
    collectionId = ROOT_COLLECTION_ALIAS
  ): Promise<{ persistentId: string }> {
    return createDataset
      .execute(DatasetDTOMapper.toJSDatasetDTO(dataset), collectionId)
      .then((jsDatasetIdentifiers: JSDatasetIdentifiers) => ({
        persistentId: jsDatasetIdentifiers.persistentId
      }))
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }
  publish(
    persistentId: string,
    versionUpdateType: VersionUpdateType = VersionUpdateType.MAJOR
  ): Promise<void> {
    let jsVersionUpdateType: JSVersionUpdateType

    switch (versionUpdateType) {
      case VersionUpdateType.MINOR:
        jsVersionUpdateType = JSVersionUpdateType.MINOR
        break
      case VersionUpdateType.MAJOR:
        jsVersionUpdateType = JSVersionUpdateType.MAJOR
        break
      case VersionUpdateType.UPDATE_CURRENT:
        jsVersionUpdateType = JSVersionUpdateType.UPDATE_CURRENT
        break
      default:
        throw new Error('Invalid version update type')
    }

    return publishDataset.execute(persistentId, jsVersionUpdateType).catch((error: WriteError) => {
      throw new Error(error.message)
    })
    return publishDataset.execute(persistentId, jsVersionUpdateType).catch((error: WriteError) => {
      throw new Error(error.message)
    })
  }

  updateMetadata(datasetId: string | number, updatedDataset: DatasetDTO): Promise<void> {
    return updateDataset
      .execute(datasetId, DatasetDTOMapper.toJSDatasetDTO(updatedDataset))
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }
}
