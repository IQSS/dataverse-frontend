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
      metadataBlocks: [
        {
          title: faker.lorem.sentence(),
          fields: [
            {
              simpleField: faker.lorem.sentence()
            },
            {
              compoundField: {
                subField1: faker.lorem.sentence(),
                subField2: faker.lorem.sentence(),
                subField3: faker.lorem.sentence()
              }
            }
          ]
        },
        {
          title: faker.lorem.sentence(),
          fields: [
            {
              simpleField: faker.lorem.sentence()
            },
            {
              compoundField: {
                subField1: faker.lorem.sentence(),
                subField2: faker.lorem.sentence(),
                subField3: faker.lorem.sentence()
              }
            }
          ]
        }
      ],
      ...props
    }
  }

  static createEmpty(): undefined {
    return undefined
  }
}
