import { DatasetRepository } from '../../domain/repositories/DatasetRepository'
import { DatasetStatus, Dataset } from '../../domain/models/Dataset'
import { LabelSemanticMeaning } from '../../domain/models/LabelSemanticMeaning.enum'
import { faker } from '@faker-js/faker'

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
              title: 'Description',
              description: 'this is the description field',
              value:
                'This is the description field. Here is [a link](https://dataverse.org). ' +
                'This text is *italic* and this is **bold**. Here is an image ![Alt text](https://picsum.photos/id/10/20/20) '
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
              value: 'CNN Journal [CNN.com](https://cnn.com)'
            },
            {
              title: 'Notes',
              description: 'this is the notes field',
              value: faker.lorem.paragraph(3)
            }
          ]
        })
      }, 1000)
    })
  }
}
