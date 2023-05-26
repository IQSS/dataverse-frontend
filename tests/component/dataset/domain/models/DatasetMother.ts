import { faker } from '@faker-js/faker'
import {
  ANONYMIZED_FIELD_VALUE,
  Dataset,
  DatasetStatus,
  DatasetVersion,
  DatasetLabelSemanticMeaning
} from '../../../../../src/dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../../../../src/dataset/domain/models/Dataset'

export class DatasetMother {
  static createEmpty(): undefined {
    return undefined
  }

  static create(props?: Partial<Dataset>): Dataset {
    return {
      persistentId: faker.datatype.uuid(),
      title: faker.lorem.sentence(),
      version: new DatasetVersion(1, 0, DatasetStatus.RELEASED),
      citation:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1',
      license: {
        name: 'CC0 1.0',
        uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
        iconUri: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
      },
      labels: [
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: faker.lorem.word(),
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        }
      ],
      metadataBlocks: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            title: faker.lorem.sentence(),
            subject: [faker.lorem.word(), faker.lorem.word()],
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
            geographicCoverage: {
              geographicCoverageCountry: faker.lorem.sentence(),
              geographicCoverageCity: faker.lorem.sentence()
            }
          }
        }
      ],
      summaryFields: [
        {
          name: MetadataBlockName.CITATION,
          fields: {
            dsDescription: faker.lorem.sentence(),
            keyword: faker.lorem.sentence(),
            subject: faker.lorem.sentence(),
            publication: faker.lorem.sentence(),
            notesText: faker.lorem.sentence()
          }
        }
      ],
      ...props
    }
  }

  static createAnonymized(): Dataset {
    return this.create({
      citation:
        'Author name(s) withheld, 2023, "citation", <a href="https://doi.org/10.5072/FK2/BUDNRV" target="_blank">https://doi.org/10.5072/FK2/BUDNRV</a>, Root, V1',
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
