import { faker } from '@faker-js/faker'
import {
  ANONYMIZED_FIELD_VALUE,
  Dataset,
  DatasetLabelSemanticMeaning,
  DatasetLabelValue,
  DatasetStatus,
  DatasetVersion,
  MetadataBlockName,
  DatasetMetadataBlocks
} from '../../../../../src/dataset/domain/models/Dataset'

export class DatasetMother {
  static createEmpty(): undefined {
    return undefined
  }

  static create(props?: Partial<Dataset>): Dataset {
    const dataset = {
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
          value: DatasetLabelValue.IN_REVIEW,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: DatasetLabelValue.EMBARGOED,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: DatasetLabelValue.UNPUBLISHED,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
        },
        {
          value: `Version ${faker.lorem.word()}`,
          semanticMeaning: faker.helpers.arrayElement(Object.values(DatasetLabelSemanticMeaning))
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
                authorIdentifier: faker.lorem.word()
              },
              {
                authorName: faker.lorem.sentence(),
                authorAffiliation: faker.lorem.sentence(),
                authorIdentifierScheme: faker.lorem.sentence(),
                authorIdentifier: faker.lorem.word()
              }
            ],
            datasetContact: [
              {
                datasetContactName: faker.lorem.sentence(),
                datasetContactEmail: faker.internet.email()
              }
            ],
            dsDescription: [
              {
                dsDescriptionValue: faker.lorem.sentence()
              }
            ],
            producer: [
              {
                producerName: faker.lorem.sentence(),
                producerURL: faker.internet.url(),
                producerLogoURL: faker.image.imageUrl()
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
      ] as DatasetMetadataBlocks,
      ...props
    }

    return new Dataset.Builder(
      dataset.persistentId,
      dataset.version,
      dataset.citation,
      dataset.summaryFields,
      dataset.license,
      dataset.metadataBlocks
    ).build()
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
            subject: [faker.lorem.word(), faker.lorem.word()],
            author: ANONYMIZED_FIELD_VALUE,
            datasetContact: [
              {
                datasetContactName: faker.lorem.sentence(),
                datasetContactEmail: faker.internet.email()
              }
            ],
            dsDescription: ANONYMIZED_FIELD_VALUE
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
