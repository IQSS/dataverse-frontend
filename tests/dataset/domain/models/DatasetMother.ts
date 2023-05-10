import { faker } from '@faker-js/faker'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'

export class DatasetMother {
  static create(props?: Partial<Dataset>): Dataset {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      version: faker.datatype.uuid(),
      displayCitation:
        'K, Ellen, 2023, "Test Terms", https://doi.org/10.70122/FK2/KLX4XO, Demo Dataverse, V1',
      license: {
        name: 'CC0 1.0',
        shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
      summaryFields: [
        {
          title: 'Description',
          description: 'this is the description field',
          value: faker.lorem.paragraph(3)
        },

        {
          title: 'Subject',
          description: 'this is the subject field',
          value: faker.lorem.words(5)
        },
        {
          title: 'Keyword',
          description: 'this is the keyword field',
          value: faker.lorem.words(3)
        },
        {
          title: 'Related Publication',
          description: 'this is the keyword field',
          value: faker.lorem.words(3)
        },
        {
          title: 'Notes',
          description: 'this is the notes field',
          value: faker.lorem.paragraph(3)
        }
      ],
      ...props
    }
  }
}
