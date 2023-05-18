import { LabelSemanticMeaning } from '../../dataset/domain/models/Dataset'
import { MetadataBlockName } from '../../dataset/domain/models/Dataset'
import { Dataset } from '../../dataset/domain/models/Dataset'

export const DatasetMockData = (props?: Partial<Dataset>): Dataset => ({
  id: '123456789',
  title: 'Dataset title',
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
      value: 'Here is an image ![Alt text](https://picsum.photos/id/10/40/40)'
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
    }
  ],
  ...props
})
