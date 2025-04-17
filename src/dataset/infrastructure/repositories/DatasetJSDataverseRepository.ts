import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset, DatasetLock, DatasetNonNumericVersion } from '../../domain/models/Dataset'
import { DatasetVersionDiff } from '../../domain/models/DatasetVersionDiff'
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
  DatasetVersionDiff as JSDatasetVersionDiff,
  DatasetVersionSummaryInfo as JSDatasetVersionSummaryInfo,
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
  deaccessionDataset,
  VersionUpdateType as JSVersionUpdateType,
  WriteError,
  getDatasetVersionDiff,
  DatasetDeaccessionDTO,
  getDatasetVersionsSummaries,
  getDatasetDownloadCount,
  deleteDataset
} from '@iqss/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'
import { DatasetPaginationInfo } from '../../domain/models/DatasetPaginationInfo'
import { JSDatasetPreviewMapper } from '../mappers/JSDatasetPreviewMapper'
import { DatasetDTO } from '../../domain/useCases/DTOs/DatasetDTO'
import { DatasetDTOMapper } from '../mappers/DatasetDTOMapper'
import { DatasetsWithCount } from '../../domain/models/DatasetsWithCount'
import { VersionUpdateType } from '../../domain/models/VersionUpdateType'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetDownloadCount } from '@/dataset/domain/models/DatasetDownloadCount'

const includeDeaccessioned = true

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
  datasetVersionDiff?: JSDatasetVersionDiff
  jsDatasetVersionsSummaries: JSDatasetVersionSummaryInfo[]
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
  getVersionDiff(
    persistentId: string,
    oldVersion: string,
    newVersion: string,
    includeDeaccessioned: boolean
  ): Promise<DatasetVersionDiff> {
    return getDatasetVersionDiff
      .execute(persistentId, oldVersion, newVersion, includeDeaccessioned)
      .then((jsDatasetVersionDiff) => {
        return JSDatasetMapper.toDatasetVersionDiff(jsDatasetVersionDiff)
      })
  }

  private async getLatestPublishedVersionNumbers(
    datasetDetails: IDatasetDetails
  ): Promise<IDatasetDetails> {
    await getDataset
      .execute(
        datasetDetails.jsDataset.persistentId,
        DatasetNonNumericVersion.LATEST_PUBLISHED,
        includeDeaccessioned
      )
      .then((latestPublishedDataset) => {
        datasetDetails.latestPublishedVersionMajorNumber =
          latestPublishedDataset.versionInfo.majorNumber
        datasetDetails.latestPublishedVersionMinorNumber =
          latestPublishedDataset.versionInfo.minorNumber
        return datasetDetails
      })

    return datasetDetails
  }

  private async getVersionDiffDetails(datasetDetails: IDatasetDetails): Promise<IDatasetDetails> {
    await this.getVersionDiff(
      datasetDetails.jsDataset.persistentId,
      DatasetNonNumericVersion.LATEST_PUBLISHED,
      DatasetNonNumericVersion.DRAFT,
      includeDeaccessioned
    ).then((datasetVersionDiff) => {
      datasetDetails.datasetVersionDiff = datasetVersionDiff
      return datasetDetails
    })

    return datasetDetails
  }

  private async fetchDatasetDetails(
    jsDataset: JSDataset,
    version?: string
  ): Promise<IDatasetDetails> {
    return Promise.all([
      getDatasetSummaryFieldNames.execute(),
      getDatasetCitation.execute(jsDataset.id, version, includeDeaccessioned),
      getDatasetUserPermissions.execute(jsDataset.id),
      getDatasetLocks.execute(jsDataset.id),
      getDatasetVersionsSummaries.execute(jsDataset.id)
    ]).then(
      ([
        summaryFieldsNames,
        citation,
        jsDatasetPermissions,
        jsDatasetLocks,
        jsDatasetVersionsSummaries
      ]: [
        string[],
        string,
        JSDatasetPermissions,
        JSDatasetLock[],
        JSDatasetVersionSummaryInfo[]
      ]) => {
        return {
          jsDataset,
          summaryFieldsNames,
          citation,
          jsDatasetPermissions,
          jsDatasetLocks,
          jsDatasetVersionsSummaries,
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
    requestedVersion?: string,
    keepRawFields?: boolean
  ): Promise<Dataset | undefined> {
    return getDataset
      .execute(persistentId, version, includeDeaccessioned, keepRawFields)
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
          // numbers of the latest published version and the datasetVersionDiff,
          // for the PublishDatasetModal component.
          return this.getLatestPublishedVersionNumbers(datasetDetails).then((updatedDetails) =>
            this.getVersionDiffDetails(updatedDetails)
          )
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
          datasetDetails.jsDatasetVersionsSummaries,
          requestedVersion,
          undefined,
          datasetDetails.latestPublishedVersionMajorNumber,
          datasetDetails.latestPublishedVersionMinorNumber,
          datasetDetails.datasetVersionDiff
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
          (requestedVersion = version),
          keepRawFields
        )
      })
  }
  getByPrivateUrlToken(privateUrlToken: string): Promise<Dataset | undefined> {
    return Promise.all([
      getPrivateUrlDataset.execute(privateUrlToken),
      getDatasetSummaryFieldNames.execute(),
      getPrivateUrlDatasetCitation.execute(privateUrlToken)
    ])
      .then(async ([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) => {
        const [permissions, locks, originalSize, archivalSize, versionsSummaries] =
          await Promise.all([
            getDatasetUserPermissions.execute(jsDataset.id),
            getDatasetLocks.execute(jsDataset.id),
            getDatasetFilesTotalDownloadSize.execute(
              jsDataset.id,
              DatasetNonNumericVersion.DRAFT,
              FileDownloadSizeMode.ORIGINAL,
              undefined,
              includeDeaccessioned
            ),
            getDatasetFilesTotalDownloadSize.execute(
              jsDataset.id,
              DatasetNonNumericVersion.DRAFT,
              FileDownloadSizeMode.ARCHIVAL,
              undefined,
              includeDeaccessioned
            ),
            getDatasetVersionsSummaries.execute(jsDataset.id)
          ])

        return JSDatasetMapper.toDataset(
          jsDataset,
          citation,
          summaryFieldsNames,
          permissions,
          locks,
          originalSize,
          archivalSize,
          versionsSummaries
        )
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  create(dataset: DatasetDTO, collectionId: string): Promise<{ persistentId: string }> {
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
  }

  updateMetadata(
    datasetId: string | number,
    updatedDataset: DatasetDTO,
    internalVersionNumber: number
  ): Promise<void> {
    return updateDataset
      .execute(datasetId, DatasetDTOMapper.toJSDatasetDTO(updatedDataset), internalVersionNumber)
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }
  deaccession(
    datasetId: string | number,
    version: string,
    deaccessionDTO: DatasetDeaccessionDTO
  ): Promise<void> {
    return deaccessionDataset
      .execute(datasetId, version, deaccessionDTO)
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }
  getDatasetVersionsSummaries(datasetId: number | string): Promise<DatasetVersionSummaryInfo[]> {
    return getDatasetVersionsSummaries.execute(datasetId).catch((error: ReadError) => {
      throw error
    })
  }
  getDownloadCount(
    datasetId: string | number,
    includeMDC?: boolean
  ): Promise<DatasetDownloadCount> {
    return getDatasetDownloadCount
      .execute(datasetId, includeMDC)
      .then((jsDatasetDownloadCount) => jsDatasetDownloadCount)
  }
  deleteDataset(datasetId: string | number): Promise<void> {
    return deleteDataset.execute(datasetId).catch((error: WriteError) => {
      throw new Error(error.message)
    })
  }
}
