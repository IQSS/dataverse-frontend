import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { Dataset, MetadataBlockName } from '../../domain/models/Dataset'
import { LabelSemanticMeaning } from '../../domain/models/Dataset'

export class DatasetJSDataverseRepository implements DatasetRepository {
  /* eslint-disable-next-line unused-imports/no-unused-vars */
  getById(id: string): Promise<Dataset | undefined> {
    // TODO - Implement this method using the js-dataverse module
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
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
          templateId: '123456789'
        })
      }, 1000)
    })
  }
}
