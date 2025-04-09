import { faker } from '@faker-js/faker'
import { DatasetVersionDiff } from '../../../../../src/dataset/domain/models/DatasetVersionDiff'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'

export class DatasetVersionDiffMother {
  static create(): DatasetVersionDiff {
    const datasetVersionDiff = {
      oldVersion: {
        versionNumber: '1.0',
        lastUpdatedDate: '2023-05-15T08:21:03Z',
        versionState: DatasetVersionState.RELEASED
      },
      newVersion: {
        versionNumber: '1.1',
        lastUpdatedDate: '2023-05-20T08:21:03Z',
        versionState: DatasetVersionState.DRAFT
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
          fileName: 'file10',
          MD5: faker.datatype.uuid(),
          type: '',
          fileId: faker.datatype.number(),
          description: 'file1 description',
          isRestricted: faker.datatype.boolean(),
          filePath: '',
          tags: [],
          categories: []
        }
      ],
      filesChanges: [
        {
          fileName: 'file4',
          md5: faker.datatype.uuid(),
          fileId: faker.datatype.number(),
          changed: [
            {
              fieldName: 'isRestricted',
              oldValue: 'old title',
              newValue: 'new title'
            }
          ]
        }
      ],
      fileReplaced: [
        {
          oldFile: {
            fileName: 'file5',
            MD5: faker.datatype.uuid(),
            type: '',
            fileId: faker.datatype.number(),
            description: 'file5 description',
            isRestricted: faker.datatype.boolean(),
            filePath: '',
            tags: [],
            categories: []
          },
          newFile: {
            fileName: 'file6',
            MD5: faker.datatype.uuid(),
            type: '',
            fileId: faker.datatype.number(),
            description: 'file6 description',
            isRestricted: faker.datatype.boolean(),
            filePath: '',
            tags: [],
            categories: []
          }
        }
      ],
      termsOfAccess: {
        changed: [
          {
            fieldName: 'Terms of Access for Restricted Files',
            oldValue: 'old value',
            newValue: 'new value'
          }
        ]
      }
    }
    return datasetVersionDiff
  }
}
