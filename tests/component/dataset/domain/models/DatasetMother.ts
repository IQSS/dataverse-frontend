import { faker } from '@faker-js/faker'
import { Dataset } from '../../../../../src/dataset/domain/models/Dataset'
import { LabelSemanticMeaning } from '../../../../../src/dataset/domain/models/LabelSemanticMeaning.enum'

export class DatasetMother {
  static create(props?: Partial<Dataset>): Dataset {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      labels: [
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(LabelSemanticMeaning))
        }
      ],
      summaryFields: [
        {
          title: faker.lorem.word(),
          description: faker.lorem.sentence(),
          value: faker.lorem.sentence()
        },
        {
          title: faker.lorem.word(),
          description: faker.lorem.sentence(),
          value: faker.lorem.sentence()
        },
        {
          title: faker.lorem.word(),
          description: faker.lorem.sentence(),
          value: faker.lorem.sentence()
        },
        {
          title: faker.lorem.word(),
          description: faker.lorem.sentence(),
          value: faker.lorem.sentence()
        },
        {
          title: faker.lorem.word(),
          description: faker.lorem.sentence(),
          value: faker.lorem.sentence()
        }
      ],
      license: {
        name: faker.lorem.sentence(),
        shortDescription: faker.lorem.sentence(),
        uri: faker.internet.url(),
        iconUrl: faker.image.imageUrl()
      },
      ...props
    }
  }

  static createEmpty(): undefined {
    return undefined
  }
}
