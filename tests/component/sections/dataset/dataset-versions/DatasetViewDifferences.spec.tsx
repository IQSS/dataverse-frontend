import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetViewDetailButton } from '@/sections/dataset/dataset-versions/DatasetViewDetailButton'
const datasetsRepository: DatasetRepository = {} as DatasetRepository

const datasetVersionDiff: DatasetVersionDiff | undefined = {
  oldVersion: {
    versionNumber: '2.0',
    lastUpdatedDate: '2025-03-11T16:22:00Z'
  },
  newVersion: {
    versionNumber: 'DRAFT',
    lastUpdatedDate: '2025-03-13T14:09:03Z'
  },

  metadataChanges: [
    {
      blockName: 'Citation Metadata',
      changed: [
        {
          fieldName: 'Title',
          oldValue: 'testdateset',
          newValue: 'testdsaddsf'
        },
        {
          fieldName: 'Subtitle',
          oldValue: '',
          newValue: 'affd'
        },
        {
          fieldName: 'Description',
          oldValue: 'd',
          newValue: 'dadadf'
        },
        {
          fieldName: 'Related Publication',
          oldValue: '',
          newValue: 'af'
        }
      ]
    }
  ],
  filesRemoved: [
    {
      fileName: 'blob (2)',
      MD5: '53d3d10e00812f7c55e0c9c3935f3769',
      type: 'application/octet-stream',
      fileId: 40,
      description: '',
      isRestricted: false,
      filePath: '',
      tags: [],
      categories: []
    },
    {
      fileName: 'blob',
      MD5: '53d3d10e00812f7c55e0c9c3935f3769',
      type: 'application/octet-stream',
      fileId: 41,
      description: '',
      isRestricted: false,
      filePath: '',
      tags: [],
      categories: []
    },
    {
      fileName: 'blob (1)',
      MD5: '53d3d10e00812f7c55e0c9c3935f3769',
      type: 'application/octet-stream',
      fileId: 42,
      description: '',
      isRestricted: false,
      filePath: '',
      tags: [],
      categories: []
    }
  ]
}

describe('DatasetDiffences', () => {
  cy.customMount(
    <DatasetViewDetailButton
      datasetRepository={datasetsRepository}
      oldVersionNumber={datasetVersionDiff.oldVersion.versionNumber}
      newVersionNumber={datasetVersionDiff.newVersion.versionNumber}
    />
  )
  datasetsRepository.getVersionDiff = cy.stub().resolves(datasetVersionDiff)
})
