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
              oldValue: 'test title',
              newValue: ''
            },
            {
              fieldName: 'Subtitle',
              oldValue: '',
              newValue: 'new test subtitle '
            },
            {
              fieldName: 'Description',
              oldValue: 'this is a test description',
              newValue: 'this is a new test description'
            }
          ]
        }
      ],
      filesAdded: [
        {
          fileName: 'file2',
          MD5: faker.datatype.uuid(),
          type: '',
          fileId: faker.datatype.number(),
          description: 'file2 description',
          isRestricted: faker.datatype.boolean(),
          filePath: '',
          tags: [],
          categories: []
        },
        {
          fileName: 'file3',
          MD5: faker.datatype.uuid(),
          type: '',
          fileId: faker.datatype.number(),
          description: 'file3 description',
          isRestricted: faker.datatype.boolean(),
          filePath: '',
          tags: [],
          categories: []
        }
      ],
      filesRemoved: [
        {
          fileName: 'file1',
          MD5: faker.datatype.uuid(),
          type: '',
          fileId: faker.datatype.number(),
          description: 'file1 description',
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
