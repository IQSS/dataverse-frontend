import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import {
  getDataset,
  getDatasetCitation,
  getDatasetSummaryFieldNames,
  Dataset as JSDataset,
  DatasetUserPermissions as JSDatasetPermissions,
  getPrivateUrlDataset,
  getPrivateUrlDatasetCitation,
  getDatasetUserPermissions,
  ReadError,
  getDatasetLocks,
  DatasetLock as JSDatasetLock
} from '@iqss/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'
import { TotalDatasetsCount } from '../../domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../domain/models/DatasetPreview'
import { DatasetPreviewMother } from '../../../../tests/component/dataset/domain/models/DatasetPreviewMother'

const includeDeaccessioned = true

export class DatasetJSDataverseRepository implements DatasetRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAll(paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    // TODO - Implement using the js-dataverse-client
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetPreviewMother.createMany(200))
      }, 1000)
    })
  }

  getTotalDatasetsCount(): Promise<TotalDatasetsCount> {
    // TODO - Implement using the js-dataverse-client
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(200)
      }, 1000)
    })
  }

  getByPersistentId(
    persistentId: string,
    version?: string,
    requestedVersion?: string
  ): Promise<Dataset | undefined> {
    return getDataset
      .execute(persistentId, this.versionToVersionId(version), includeDeaccessioned)
      .then((jsDataset) =>
        Promise.all([
          jsDataset,
          getDatasetSummaryFieldNames.execute(),
          getDatasetCitation.execute(jsDataset.id, this.versionToVersionId(version)),
          getDatasetUserPermissions.execute(jsDataset.id),
          getDatasetLocks.execute(jsDataset.id)
        ])
      )
      .then(
        ([jsDataset, summaryFieldsNames, citation, jsDatasetPermissions, jsDatasetLocks]: [
          JSDataset,
          string[],
          string,
          JSDatasetPermissions,
          JSDatasetLock[]
        ]) =>
          JSDatasetMapper.toDataset(
            jsDataset,
            citation,
            summaryFieldsNames,
            jsDatasetPermissions,
            jsDatasetLocks,
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
          },
          []
        )
      ) // TODO Connect with JS dataset permissions and getDatasetLocks.execute(privateUrlToken) when it is available in js-dataverse
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  versionToVersionId(version?: string): string | undefined {
    if (version === 'DRAFT') {
      return ':draft'
    }

    return version
  }
}
