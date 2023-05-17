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
