import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset } from '../../domain/models/Dataset'
import { LabelSemanticMeaning } from '../../domain/models/LabelSemanticMeaning.enum'

export class DatasetJSDataverseRepository implements DatasetRepository {
  getById(id: string): Promise<Dataset | undefined> {
    // TODO - Implement this method using the js-dataverse module
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          title: 'Dataset Title',
          labels: [
            { value: 'Version 1.0', semanticMeaning: LabelSemanticMeaning.FILE },
            { value: 'Draft', semanticMeaning: LabelSemanticMeaning.DATASET }
          ]
        })
      }, 1000)
    })
  }
}
