import { faker } from '@faker-js/faker'
import { Dataset } from '../../../../src/dataset/domain/models/Dataset'
import { LabelSemanticMeaning } from '../../../../src/dataset/domain/models/LabelSemanticMeaning.enum'

export class DatasetMother {
  static create(props?: Partial<Dataset>): Dataset {
    return {
      id: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      version: faker.datatype.uuid(),
      citation: {
        authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
        title: 'Test Terms',
        creationYear: 2023,
        persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
        persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
        publisher: 'Demo Dataverse',
        version: 'V1'
      },
      license: {
        name: 'CC0 1.0',
        shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
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
