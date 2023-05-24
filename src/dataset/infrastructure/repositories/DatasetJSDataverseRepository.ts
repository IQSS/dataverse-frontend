import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import {
  ANONYMIZED_FIELD_VALUE,
  Dataset,
  MetadataBlockName,
  DatasetStatus,
  LabelSemanticMeaning
} from '../../domain/models/Dataset'

export class DatasetJSDataverseRepository implements DatasetRepository {
  getById(id: string): Promise<Dataset | undefined> {
    // TODO - Implement this method using the js-dataverse module
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: id,
          title: 'Dataset Title',
          labels: [
            { value: 'Version 1.0', semanticMeaning: LabelSemanticMeaning.FILE },
            { value: 'Draft', semanticMeaning: LabelSemanticMeaning.DATASET }
          ],
          citation: {
            citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
            pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
            publisher: 'Demo Dataverse'
          },
          status: DatasetStatus.PUBLISHED,

          version: '1.0',
          license: {
            name: 'CC0 1.0',
            shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
            uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
            iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
          },
          summaryFields: [
            {
              name: MetadataBlockName.CITATION,
              fields: {
                dsDescription:
                  'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) ',
                keyword: 'Malaria, Tuberculosis, Drug Resistant',
                subject: 'Medicine, Health and Life Sciences, Social Sciences',
                publication: 'CNN Journal [CNN.com](https://cnn.com)',
                notesText: 'Here is an image ![Alt text](https://picsum.photos/id/10/40/40)'
              }
            }
          ],
          metadataBlocks: [
            {
              name: MetadataBlockName.CITATION,
              fields: {
                persistentId: 'doi:10.5072/FK2/ABC123',
                alternativePersistentId: 'doi:10.5072/FK2/ABC123',
                publicationDate: '2021-01-01',
                citationDate: '2021-01-01',
                title: 'Dataset Title',
                author: [
                  {
                    authorName: 'Admin, Dataverse',
                    authorAffiliation: 'Dataverse.org',
                    authorIdentifierScheme: 'ORCID',
                    authorIdentifier: '123456789'
                  },
                  {
                    authorName: 'Owner, Dataverse',
                    authorAffiliation: 'Dataverse.org',
                    authorIdentifierScheme: 'ORCID',
                    authorIdentifier: '123456789'
                  }
                ]
              }
            },
            {
              name: MetadataBlockName.GEOSPATIAL,
              fields: {
                geographicUnit: 'km',
                geographicCoverage: [
                  {
                    geographicCoverageCountry: 'United States',
                    geographicCoverageCity: 'Cambridge'
                  },
                  {
                    geographicCoverageCountry: 'United States',
                    geographicCoverageCity: 'Cambridge'
                  }
                ]
              }
            },
            {
              name: MetadataBlockName.ASTROPHYSICS,
              fields: {
                astroType: 'some astro type'
              }
            },
            {
              name: MetadataBlockName.BIOMEDICAL,
              fields: {
                studyDesignType: 'some design type'
              }
            },
            {
              name: MetadataBlockName.CODE_META,
              fields: {
                applicationCategory: 'some application category'
              }
            },
            {
              name: MetadataBlockName.COMPUTATIONAL_WORKFLOW,
              fields: {
                workflowDocumentation: 'some workflow documentation'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_HBGDKI,
              fields: {
                hbgdkiLowerLimitAge: 'some lower limit age'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_ARCS,
              fields: {
                ARCS3: 'some arcs3'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_CHIA,
              fields: {
                variablesCHIA: 'some variables chia'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_DIGAAI,
              fields: {
                datadePublicao: 'some datade publicao'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_GSD,
              fields: {
                gsdAccreditation: 'some gsd accreditation'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_MRA,
              fields: {
                mraCollection: 'some mra collection'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_PSI,
              fields: {
                psiPopulation: 'some psi population'
              }
            },
            {
              name: MetadataBlockName.CUSTOM_PSRI,
              fields: {
                PSRI5: 'some psri5'
              }
            },
            {
              name: MetadataBlockName.JOURNAL,
              fields: {
                journalVolume: 'some journal volume'
              }
            },
            {
              name: MetadataBlockName.SOCIAL_SCIENCE,
              fields: {
                deviationsFromSampleDesign: 'some target sample actual size'
              }
            }
          ]
        })
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getByPrivateUrlToken(privateUrlToken: string): Promise<Dataset | undefined> {
    // TODO - Implement this method using the js-dataverse module
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '123456',
          title: 'Dataset Title',
          labels: [
            { value: 'Version 1.0', semanticMeaning: LabelSemanticMeaning.FILE },
            { value: 'Draft', semanticMeaning: LabelSemanticMeaning.DATASET }
          ],
          citation: {
            citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
            pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
            publisher: 'Demo Dataverse'
          },
          status: DatasetStatus.PUBLISHED,

          version: '1.0',
          license: {
            name: 'CC0 1.0',
            shortDescription: 'CC0 1.0 Universal Public Domain Dedication',
            uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
            iconUrl: 'https://licensebuttons.net/p/zero/1.0/88x31.png'
          },
          summaryFields: [
            {
              name: MetadataBlockName.CITATION,
              fields: {
                dsDescription:
                  'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) ',
                keyword: 'Malaria, Tuberculosis, Drug Resistant',
                subject: 'Medicine, Health and Life Sciences, Social Sciences',
                publication: 'CNN Journal [CNN.com](https://cnn.com)',
                notesText: 'Here is an image ![Alt text](https://picsum.photos/id/10/40/40)'
              }
            }
          ],
          metadataBlocks: [
            {
              name: MetadataBlockName.CITATION,
              fields: {
                persistentId: 'doi:10.5072/FK2/ABC123',
                alternativePersistentId: 'doi:10.5072/FK2/ABC123',
                publicationDate: '2021-01-01',
                citationDate: '2021-01-01',
                title: 'Dataset Title',
                author: ANONYMIZED_FIELD_VALUE
              }
            },
            {
              name: MetadataBlockName.GEOSPATIAL,
              fields: {
                geographicUnit: ANONYMIZED_FIELD_VALUE,
                geographicCoverage: ANONYMIZED_FIELD_VALUE
              }
            }
          ]
        })
      }, 1000)
    })
  }
}
