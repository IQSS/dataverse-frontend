import {
  DatasetVersionSummaryInfo,
  DatasetVersionSummaryStringValues
} from '@iqss/dataverse-client-javascript'

export class DatasetVersionsSummariesMother {
  static create(): DatasetVersionSummaryInfo[] {
    const versionSummaryInfo: DatasetVersionSummaryInfo[] = [
      {
        id: 11,
        versionNumber: 'DRAFT',
        summary: {
          'Citation Metadata': {
            Title: {
              added: 0,
              deleted: 0,
              changed: 1
            }
          },
          files: {
            added: 0,
            removed: 0,
            replaced: 0,
            changedFileMetaData: 0,
            changedVariableMetadata: 0
          },
          termsAccessChanged: false
        },
        contributors: 'Test ',
        publishedOn: ''
      },
      {
        id: 10,
        versionNumber: '2.0',
        summary: {
          'Citation Metadata': {
            Description: {
              added: 0,
              deleted: 0,
              changed: 1
            },
            Title: {
              added: 0,
              deleted: 0,
              changed: 1
            }
          },
          'Additional Citation Metadata': {
            added: 2,
            deleted: 0,
            changed: 0
          },
          files: {
            added: 2,
            removed: 1,
            replaced: 0,
            changedFileMetaData: 0,
            changedVariableMetadata: 0
          },
          termsAccessChanged: false
        },
        contributors: 'Test ',
        publishedOn: '2025-03-11'
      },
      {
        id: 9,
        versionNumber: '3.0',
        summary: {
          files: {
            added: 0,
            removed: 2,
            replaced: 0,
            changedFileMetaData: 0,
            changedVariableMetadata: 0
          },
          termsAccessChanged: false
        },
        contributors: 'Test ',
        publishedOn: '2025-03-11'
      },
      {
        id: 8,
        versionNumber: '2.0',
        summary: {
          files: {
            added: 3,
            removed: 1,
            replaced: 0,
            changedFileMetaData: 0,
            changedVariableMetadata: 0
          },
          termsAccessChanged: false
        },
        contributors: 'Test ',
        publishedOn: '2025-03-11'
      },
      {
        id: 7,
        versionNumber: '1.0',
        summary: DatasetVersionSummaryStringValues.firstPublished,
        contributors: 'Test ',
        publishedOn: '2025-03-11'
      }
    ]
    return versionSummaryInfo
  }
}
