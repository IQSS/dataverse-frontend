import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import {
  getDatasetByPersistentId,
  getDatasetCitation,
  getDatasetSummaryFieldNames,
  WriteError,
  Dataset as JSDataset,
  getPrivateUrlDataset,
  getPrivateUrlDatasetCitation
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

  getByPrivateUrlToken(privateUrlToken: string): Promise<Dataset | undefined> {
    return Promise.all([
      getPrivateUrlDataset.execute(privateUrlToken),
      getDatasetSummaryFieldNames.execute()
    ])
      .then(([jsDataset, summaryFieldsNames]: [JSDataset, string[]]) =>
        Promise.all([
          jsDataset,
          summaryFieldsNames,
          getPrivateUrlDatasetCitation.execute(privateUrlToken)
        ])
      )
      .then(([jsDataset, summaryFieldsNames, citation]: [JSDataset, string[], string]) =>
        JSDatasetMapper.toDataset(jsDataset, citation, summaryFieldsNames)
      )
      .catch((error: WriteError) => {
        throw new Error(error.message)
      })
  }
}
