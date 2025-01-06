import { faker } from '@faker-js/faker'
import { DatasetVersionDiff } from '../../../../../src/dataset/domain/models/DatasetVersionDiff'

export class DatasetVersionDiffMother {
  static create(props?: Partial<DatasetVersionDiff>): DatasetVersionDiff {
    const datasetVersionDiff = {
      persistentId: faker.datatype.uuid(),
      oldVersion: {
        versionNumber: '1.0',
        lastUpdatedDate: '2023-05-15T08:21:03Z'
      },
      newVersion: {
        versionNumber: '1.1',
        lastUpdatedDate: '2023-05-20T08:21:03Z'
      },
      metadataBlockDiffs: [
        {
          blockName: 'citation',
          changed: [
            {
              fieldName: 'title',
              oldValue: 'Old Title',
              newValue: 'New Title'
            }
          ]
        }
      ],
      ...props
    }
    return datasetVersionDiff
  }
}
