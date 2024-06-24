import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset, DatasetLock } from '../../domain/models/Dataset'
import {
  getDataset,
  getAllDatasetPreviews,
  getDatasetCitation,
  getDatasetSummaryFieldNames,
  Dataset as JSDataset,
  DatasetPreview as JSDatasetPreview,
  DatasetUserPermissions as JSDatasetPermissions,
  getPrivateUrlDataset,
  getPrivateUrlDatasetCitation,
  getDatasetUserPermissions,
  ReadError,
  getDatasetLocks,
  DatasetLock as JSDatasetLock,
  getDatasetFilesTotalDownloadSize,
  FileDownloadSizeMode,
  DatasetPreviewSubset,
  createDataset,
  CreatedDatasetIdentifiers as JSDatasetIdentifiers,
  WriteError,
  publishDataset
} from '@iqss/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'
import { DatasetPaginationInfo } from '../../domain/models/DatasetPaginationInfo'
import { JSDatasetPreviewMapper } from '../mappers/JSDatasetPreviewMapper'
import { DatasetDTO } from '../../domain/useCases/DTOs/DatasetDTO'
import { DatasetDTOMapper } from '../mappers/DatasetDTOMapper'
import { DatasetsWithCount } from '../../domain/models/DatasetsWithCount'
import { VersionUpdateType } from '../../domain/models/VersionUpdateType'
const defaultCollectionId = 'root'
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
            JSDatasetPreviewMapper.toDatasetPreview(datasetPreview)
        )
        return {
          datasetPreviews: datasetPreviewsMapped,
          totalCount: subset.totalDatasetCount
        }
      })
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
    version?: string,
    requestedVersion?: string
  ): Promise<Dataset | undefined> {
    return getDataset
      .execute(persistentId, version, includeDeaccessioned)
      .then((jsDataset) => this.fetchDatasetDetails(jsDataset, version))
      .then((datasetDetails) => {
        if (datasetDetails.jsDatasetPermissions.canEditDataset) {
          return this.fetchDownloadSizes(persistentId, version).then((downloadSizes) => {
            datasetDetails.jsDatasetFilesTotalOriginalDownloadSize = downloadSizes[0]
            datasetDetails.jsDatasetFilesTotalArchivalDownloadSize = downloadSizes[1]
            return datasetDetails
          })
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
          requestedVersion
        )
      })
      .catch((error: ReadError) => {
        console.error(error)
        if (!version) {
          throw new Error(`Failed to get dataset by persistent ID: ${error.message}`)
        }
        return this.getByPersistentId(persistentId, undefined, (requestedVersion = version))
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
    collectionId = defaultCollectionId
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
    return publishDataset.execute(persistentId, versionUpdateType).catch((error: WriteError) => {
      throw new Error(error.message)
    })
  }
}
