import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import {
  getDatasetByPersistentId,
  getDatasetCitation,
  getDatasetSummaryFieldNames,
  WriteError,
  Dataset as JSDataset,
  getPrivateUrlDataset
} from '@IQSS/dataverse-client-javascript'
import { JSDatasetMapper } from '../mappers/JSDatasetMapper'

export class DatasetJSDataverseRepository implements DatasetRepository {
  getByPersistentId(persistentId: string): Promise<Dataset | undefined> {
    return Promise.all([
      getDatasetByPersistentId.execute(persistentId),
      getDatasetSummaryFieldNames.execute()
    ])
      .then(([jsDataset, summaryFieldsNames]: [JSDataset, string[]]) =>
        Promise.all([jsDataset, summaryFieldsNames, getDatasetCitation.execute(jsDataset.id)])
      )
      .then(([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) =>
        JSDatasetMapper.toDataset(jsDataset, citation, summaryFieldsNames)
      )
      .catch((error: WriteError) => {
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
