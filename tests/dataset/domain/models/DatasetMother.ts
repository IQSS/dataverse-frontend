import { faker } from '@faker-js/faker'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'

export class DatasetMother {
  static create(props?: Partial<Dataset>): Dataset {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      version: faker.datatype.uuid(),
      ...props
    }
  }
}
