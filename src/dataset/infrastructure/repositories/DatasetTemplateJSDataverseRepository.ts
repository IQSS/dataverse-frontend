import { DatasetTemplateRepository } from '../../domain/repositories/DatasetTemplateRepository'
import { DatasetTemplate } from '../../domain/models/DatasetTemplate'

export class DatasetTemplateJSDataverseRepository implements DatasetTemplateRepository {
  getById(id: string): Promise<DatasetTemplate | undefined> {
    // TODO - Implement this method using the js-dataverse module
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '123456789',
          metadataBlocksInstructions: [
            {
              title: 'This is a custom instruction for the Dataset Title field',
              author: 'This is a custom instruction for the Dataset Author field'
            }
          ]
        })
      }, 1000)
    })
  }
}
