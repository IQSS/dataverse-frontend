import { faker } from '@faker-js/faker'
import { Dataset } from '../../../../../src/dataset/domain/models/Dataset'
import { LabelSemanticMeaning } from '../../../../../src/dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../../../../src/dataset/domain/models/Dataset'

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
          name: MetadataBlockName.CITATION,
          fields: {
            title: faker.lorem.sentence(),
            author: [
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.sentence()
              },
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.sentence()
              }
            ]
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicCoverage: [
              {
                geographicCoverageCountry: faker.lorem.sentence(),
                geographicCoverageCity: faker.lorem.sentence()
              },
              {
                geographicCoverageCountry: faker.lorem.sentence(),
                geographicCoverageCity: faker.lorem.sentence()
              }
            ]
          }
        }
      ],
      ...props
    }
  }

  static createEmpty(): undefined {
    return undefined
  }
}
