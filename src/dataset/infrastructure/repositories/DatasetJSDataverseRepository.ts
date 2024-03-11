import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
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
  DatasetPreviewSubset
} from '@iqss/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'
import { TotalDatasetsCount } from '../../domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../domain/models/DatasetPreview'
import { JSDatasetPreviewMapper } from '../mappers/JSDatasetPreviewMapper'
import { DatasetFormFields } from '../../domain/models/DatasetFormFields'
import { DatasetsWithCount } from '../../domain/models/DatasetsWithCount'

const includeDeaccessioned = true

export class DatasetJSDataverseRepository implements DatasetRepository {
  getAll(collectionId: string, paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    return getAllDatasetPreviews
      .execute(paginationInfo.pageSize, paginationInfo.offset, collectionId)
      .then((subset: DatasetPreviewSubset) => {
        return subset.datasetPreviews.map((datasetPreview: JSDatasetPreview) =>
          JSDatasetPreviewMapper.toDatasetPreview(datasetPreview)
        )
      })
  }

  getTotalDatasetsCount(collectionId: string): Promise<TotalDatasetsCount> {
    // TODO: refactor this so we don't make the same call twice?
    return getAllDatasetPreviews
      .execute(10, 0, collectionId)
      .then((subset: DatasetPreviewSubset) => {
        return subset.totalDatasetCount
      })
  }

  getDatasetsWithCount(
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

  getByPersistentId(
    persistentId: string,
    version?: string,
    requestedVersion?: string
  ): Promise<Dataset | undefined> {
    return getDataset
      .execute(persistentId, version, includeDeaccessioned)
      .then((jsDataset) =>
        Promise.all([
          jsDataset,
          getDatasetSummaryFieldNames.execute(),
          getDatasetCitation.execute(jsDataset.id, version, includeDeaccessioned),
          getDatasetUserPermissions.execute(jsDataset.id),
          getDatasetLocks.execute(jsDataset.id),
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
      )
      .then(
        ([
          jsDataset,
          summaryFieldsNames,
          citation,
          jsDatasetPermissions,
          jsDatasetLocks,
          jsDatasetFilesTotalOriginalDownloadSize,
          jsDatasetFilesTotalArchivalDownloadSize
        ]: [JSDataset, string[], string, JSDatasetPermissions, JSDatasetLock[], number, number]) =>
          JSDatasetMapper.toDataset(
            jsDataset,
            citation,
            summaryFieldsNames,
            jsDatasetPermissions,
            jsDatasetLocks,
            jsDatasetFilesTotalOriginalDownloadSize,
            jsDatasetFilesTotalArchivalDownloadSize,
            requestedVersion
          )
      )
      .catch((error: ReadError) => {
        if (!version) {
          throw new Error(error.message)
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

  createDataset(fields: DatasetFormFields): Promise<string> {
    const returnMsg = 'Form Data Submitted: ' + JSON.stringify(fields)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(returnMsg)
      }, 1000)
    })
  }
}
