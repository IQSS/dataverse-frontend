import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import {
  getDatasetByPersistentId,
  getDatasetSummaryFieldNames,
  WriteError
} from '@IQSS/dataverse-client-javascript'
import { DatasetMapper } from '../mappers/DatasetMapper'

export class DatasetJSDataverseRepository implements DatasetRepository {
  getByPersistentId(persistentId: string): Promise<Dataset | undefined> {
    return Promise.all([
      getDatasetByPersistentId.execute(persistentId),
      getDatasetSummaryFieldNames.execute()
    ])
      .then(([jsDataset, summaryFieldsNames]) =>
        DatasetMapper.toModel(jsDataset, summaryFieldsNames)
      )
      .catch((error: WriteError) => {
        console.log(error)
        throw new Error(error.message)
      })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getByPrivateUrlToken(privateUrlToken: string): Promise<Dataset | undefined> {
    // TODO - Implement this method using the js-dataverse module
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }
}
