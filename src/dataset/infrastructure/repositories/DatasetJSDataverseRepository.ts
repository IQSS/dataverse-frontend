import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import {
  getDataset,
  getDatasetCitation,
  getDatasetSummaryFieldNames,
  Dataset as JSDataset,
  getPrivateUrlDataset,
  getPrivateUrlDatasetCitation,
  ReadError,
  getDatasetLocks,
  DatasetLock as JSDatasetLock
} from '@iqss/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'
import { TotalDatasetsCount } from '../../domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../domain/models/DatasetPreview'
import { DatasetPreviewMother } from '../../../../tests/component/dataset/domain/models/DatasetPreviewMother'

export class DatasetJSDataverseRepository implements DatasetRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAll(paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    // TODO - Implement using the js-dataverse-client
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetPreviewMother.createManyRealistic(10))
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
      .execute(persistentId, this.versionToVersionId(version))
      .then((jsDataset) =>
        Promise.all([
          jsDataset,
          getDatasetSummaryFieldNames.execute(),
          getDatasetCitation.execute(jsDataset.id, this.versionToVersionId(version)),
          getDatasetLocks.execute(jsDataset.id)
        ])
      )
      .then(
        ([jsDataset, summaryFieldsNames, citation, jsDatasetLocks]: [
          JSDataset,
          string[],
          string,
          JSDatasetLock[]
        ]) =>
          JSDatasetMapper.toDataset(
            jsDataset,
            citation,
            summaryFieldsNames,
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
    ]) // TODO - Add getDatasetLocks.execute(privateUrlToken) when it is available in js-dataverse
      .then(([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) =>
        JSDatasetMapper.toDataset(jsDataset, citation, summaryFieldsNames, [])
      )
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
