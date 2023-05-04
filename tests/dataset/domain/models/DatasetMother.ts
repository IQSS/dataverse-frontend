import { faker } from '@faker-js/faker'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'

export class DatasetMother {
  static create(props?: Partial<Dataset>): Dataset {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      version: faker.datatype.uuid(),
      description: faker.lorem.lines(4),
      subject: faker.lorem.slug(3),
      keyword: faker.lorem.slug(4),
      ...props
    }
  }
}
