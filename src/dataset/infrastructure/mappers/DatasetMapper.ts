import { Dataset as jsDataset } from 'js-dataverse'
import { Dataset } from '../../domain/models/Dataset'

export class DatasetMapper {
  static toModel(jsDataset: jsDataset): Dataset {
    return {
      persistentId: jsDataset.persistentId,
      title: jsDataset.metadataBlocks[0].fields.title as string,
      labels: [],
      summaryFields: [],
      license: {
        name: jsDataset.license.name,
        shortDescription: '',
        uri: jsDataset.license.uri
      },
      metadataBlocks: []
    }
  }
}
