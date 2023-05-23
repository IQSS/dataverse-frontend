import { faker } from '@faker-js/faker'
import { ANONYMIZED_FIELD_VALUE, Dataset } from '../../../../../src/dataset/domain/models/Dataset'
import { LabelSemanticMeaning } from '../../../../../src/dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../../../../src/dataset/domain/models/Dataset'

export class DatasetMother {
  static create(props?: Partial<Dataset>): Dataset {
    return {
      persistentId: faker.datatype.uuid(),
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

  static createAnonymized(): Dataset {
    return this.create({
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: faker.lorem.sentence(),
            author: ANONYMIZED_FIELD_VALUE
          }
        },
        {
          name: MetadataBlockName.GEOSPATIAL,
          fields: {
            geographicCoverage: ANONYMIZED_FIELD_VALUE
          }
        }
      ]
    })
  }
}
