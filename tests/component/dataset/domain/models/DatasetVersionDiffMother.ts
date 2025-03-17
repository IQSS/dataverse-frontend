import { faker } from '@faker-js/faker'
import { DatasetVersionDiff } from '../../../../../src/dataset/domain/models/DatasetVersionDiff'

export class DatasetVersionDiffMother {
  static create(): DatasetVersionDiff {
    const datasetVersionDiff = {
      oldVersion: {
        versionNumber: '2.0',
        lastUpdatedDate: faker.date.recent().toISOString()
      },
      newVersion: {
        versionNumber: 'DRAFT',
        lastUpdatedDate: faker.date.recent().toISOString()
      },

      metadataChanges: [
        {
          blockName: 'Citation Metadata',
          changed: [
            {
              fieldName: 'Title',
              oldValue: faker.datatype.string(),
              newValue: ''
            },
            {
              fieldName: 'Subtitle',
              oldValue: '',
              newValue: faker.datatype.string()
            },
            {
              fieldName: 'Description',
              oldValue: faker.datatype.string(),
              newValue: faker.datatype.string()
            }
          ]
        }
      ],
      filesAdded: [
        {
          fileName: faker.datatype.string(),
          MD5: faker.datatype.uuid(),
          type: '',
          fileId: faker.datatype.number(),
          description: '',
          isRestricted: faker.datatype.boolean(),
          filePath: '',
          tags: [],
          categories: []
        },
        {
          fileName: faker.datatype.string(),
          MD5: faker.datatype.uuid(),
          type: '',
          fileId: faker.datatype.number(),
          description: '',
          isRestricted: faker.datatype.boolean(),
          filePath: '',
          tags: [],
          categories: []
        }
      ],
      filesRemoved: [
        {
          fileName: faker.datatype.string(),
          MD5: faker.datatype.uuid(),
          type: '',
          fileId: faker.datatype.number(),
          description: faker.datatype.string(),
          isRestricted: faker.datatype.boolean(),
          filePath: '',
          tags: [],
          categories: []
        }
      ]
    }
    return datasetVersionDiff
  }
}
