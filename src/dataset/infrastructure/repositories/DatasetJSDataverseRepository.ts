import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset, MetadataBlockName } from '../../domain/models/Dataset'
import { LabelSemanticMeaning } from '../../domain/models/Dataset'

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
              value: 'This is a description of the dataset'
            },
            {
              title: 'Keyword',
              description: 'this is the keyword field',
              value: 'Malaria, Tuberculosis, Drug Resistant'
            },
            {
              title: 'Subject',
              description: 'this is the subject field',
              value: 'Medicine, Health and Life Sciences, Social Sciences'
            },

            {
              title: 'Related Publication',
              description: 'this is the keyword field',
              value: 'https://doi.org/10.5072/FK2/ABC123'
            },
            {
              title: 'Notes',
              description: 'this is the notes field',
              value: 'image'
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
}
