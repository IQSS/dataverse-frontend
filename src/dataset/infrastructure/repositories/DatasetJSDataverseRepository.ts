import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import {
  ANONYMIZED_FIELD_VALUE,
  Dataset,
  DatasetStatus,
  DatasetVersion,
  MetadataBlockName
} from '../../domain/models/Dataset'
import { LabelSemanticMeaning } from '../../domain/models/Dataset'
import { getDatasetByPersistentId, WriteError } from '@IQSS/dataverse-client-javascript'
import { DatasetMapper } from '../mappers/DatasetMapper'

export class DatasetJSDataverseRepository implements DatasetRepository {
  getByPersistentId(persistentId: string): Promise<Dataset | undefined> {
    return getDatasetByPersistentId
      .execute(persistentId)
      .then((dataset) => DatasetMapper.toModel(dataset))
      .catch((error: WriteError) => {
        console.log(error)
        throw new Error(error.message)
      })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getByPrivateUrlToken(privateUrlToken: string): Promise<Dataset | undefined> {
    // TODO - Implement this method using the js-dataverse module
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          persistentId: '123456',
          title: 'Dataset Title',
          labels: [
            { value: 'Version 1.0', semanticMeaning: LabelSemanticMeaning.FILE },
            { value: 'Draft', semanticMeaning: LabelSemanticMeaning.DATASET }
          ],
          citation: {
            citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
            url: 'https://doi.org/10.70122/FK2/KLX4XO',
            publisher: 'Demo Dataverse'
          },
          version: new DatasetVersion(1, 0, DatasetStatus.RELEASED),
          license: {
            name: 'CC0 1.0',
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
