import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import {
  getDataset,
  getDatasetCitation,
  getDatasetSummaryFieldNames,
  Dataset as JSDataset,
  getPrivateUrlDataset,
  getPrivateUrlDatasetCitation,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'

export class DatasetJSDataverseRepository implements DatasetRepository {
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
          getDatasetCitation.execute(jsDataset.id, this.versionToVersionId(version))
        ])
      )
      .then(([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) =>
        JSDatasetMapper.toDataset(jsDataset, citation, summaryFieldsNames, requestedVersion)
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
        JSDatasetMapper.toDataset(jsDataset, citation, summaryFieldsNames)
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
