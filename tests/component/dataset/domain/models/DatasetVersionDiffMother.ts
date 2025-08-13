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
          MD5: '07e75de3-1e55-49ef-a1cc-09eaff05c511',
          type: '',
          fileId: 1,
          description: 'file2 description',
          isRestricted: true,
          filePath: '',
          tags: [],
          categories: []
        },
        {
          fileName: 'file3',
          MD5: '07e75de3-1e55-49ef-a1cc-09eaff05c522',
          type: '',
          fileId: 2,
          description: 'file3 description',
          isRestricted: false,
          filePath: '',
          tags: [],
          categories: []
        }
      ],
      filesRemoved: [
        {
          fileName: 'file10',
          MD5: '07e75de3-1e55-49ef-a1cc-09eaff05c533',
          type: '',
          fileId: 3,
          description: 'file1 description',
          isRestricted: true,
          filePath: '',
          tags: [],
          categories: []
        }
      ],
      filesChanges: [
        {
          fileName: 'file4',
          md5: '07e75de3-1e55-49ef-a1cc-09eaff05c544',
          fileId: 4,
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
            MD5: '07e75de3-1e55-49ef-a1cc-09eaff05c555',
            type: '',
            fileId: 5,
            description: 'file5 description',
            isRestricted: true,
            filePath: '',
            tags: [],
            categories: []
          },
          newFile: {
            fileName: 'file6',
            MD5: '07e75de3-1e55-49ef-a1cc-09eaff05c566',
            type: '',
            fileId: 6,
            description: 'file6 description',
            isRestricted: false,
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
