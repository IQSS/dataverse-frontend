import { faker } from '@faker-js/faker'
import { DatasetTemplate } from '../../../../../src/dataset/domain/models/DatasetTemplate'

export class DatasetTemplateMother {
  static create(props?: Partial<DatasetTemplate>): DatasetTemplate {
    return {
      id: faker.datatype.uuid(),
      metadataBlocksInstructions: [
        {
          title: faker.lorem.sentence(),
          author: faker.lorem.sentence()
        }
      ],
      ...props
    }
  }

  static createEmpty(): undefined {
    return undefined
  }
}
