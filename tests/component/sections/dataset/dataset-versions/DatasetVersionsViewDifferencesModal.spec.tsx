import { DatasetVersionDiff } from '@/dataset/domain/models/DatasetVersionDiff'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { VersionDetailModal } from '@/sections/dataset/dataset-versions/view-difference/DatasetVersionsDetailModal'
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
          newValue: ''
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
  filesAdded: [
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
      fileName: 'blob (5)',
      MD5: '53d3d10e00812f7c55e0c9c3935f3769',
      type: '',
      fileId: 40,
      description: '',
      isRestricted: true,
      filePath: '',
      tags: [],
      categories: []
    }
  ],
  filesRemoved: [
    {
      fileName: 'blob (2)',
      MD5: '53d3d10e00812f7c55e0c9c3935f3769',
      type: '',
      fileId: 40,
      description: '',
      isRestricted: true,
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

describe('DatasetVersions', () => {
  it('should render a table with neccessary information for comparison of two versions', () => {
    cy.customMount(
      <VersionDetailModal
        show={true}
        handleClose={() => {}}
        isLoading={false}
        errorHandling={''}
        datasetVersionDifferences={datasetVersionDiff}
      />
    )
    datasetsRepository.getVersionDiff = cy.stub().resolves(datasetVersionDiff)

    cy.get('table').should('exist')
    cy.get('table').find('tbody').first().find('tr').should('have.length', 1) // for versions info
    const numOfTbody = (datasetVersionDiff?.metadataChanges?.length ?? 0) + 2 // add extra 2 for Versions info(header) and Files tables
    cy.get('table').find('tbody').should('have.length', numOfTbody)
    const numOfFilesTr =
      (datasetVersionDiff?.filesRemoved?.length ?? 0) +
      (datasetVersionDiff?.filesAdded?.length ?? 0)
    cy.get('table').find('tbody').last().find('tr').should('have.length', numOfFilesTr)
  })

  it('should render a correct file info', () => {
    cy.customMount(
      <VersionDetailModal
        show={true}
        handleClose={() => {}}
        isLoading={false}
        errorHandling={''}
        datasetVersionDifferences={datasetVersionDiff}
      />
    )
    datasetsRepository.getVersionDiff = cy.stub().resolves(datasetVersionDiff)

    cy.get('table').should('exist')
    const FileId = datasetVersionDiff?.filesRemoved?.[0].fileId ?? 'N/A'
    const MD5 = datasetVersionDiff?.filesRemoved?.[0].MD5 ?? 'N/A'
    const text = `File ID ${FileId}MD5 ${MD5}`
    cy.get('table')
      .find('tbody')
      .last()
      .find('tr')
      .first()
      .find('td')
      .first()
      .should('have.text', text)
  })

  it('should handle empty file lists', () => {
    cy.customMount(
      <VersionDetailModal
        show={true}
        handleClose={() => {}}
        isLoading={false}
        errorHandling={''}
        datasetVersionDifferences={{
          ...datasetVersionDiff,
          filesRemoved: [],
          filesAdded: []
        }}
      />
    )

    cy.get('table').should('exist')
    cy.get('table').find('tbody').should('have.length', 3)
    cy.get('table').find('tbody').last().find('tr').should('have.length', 0)
  })

  it('should render a modal with the differences between two versions', () => {
    cy.customMount(
      <VersionDetailModal
        show={true}
        handleClose={() => {}}
        isLoading={true}
        errorHandling={''}
        datasetVersionDifferences={datasetVersionDiff}
      />
    )

    cy.get('span').should('exist')
    cy.get('table').should('not.exist')
  })

  it('should render a modal with error message', () => {
    cy.customMount(
      <VersionDetailModal
        show={true}
        handleClose={() => {}}
        isLoading={false}
        errorHandling={'Error message'}
        datasetVersionDifferences={datasetVersionDiff}
      />
    )

    cy.findByText('Error message').should('exist')
    cy.get('table').should('not.exist')
  })

  it('should render a modal with loading spinner', () => {
    cy.customMount(
      <VersionDetailModal
        show={true}
        handleClose={() => {}}
        isLoading={true}
        errorHandling={''}
        datasetVersionDifferences={datasetVersionDiff}
      />
    )

    cy.get('table').should('not.exist')
    cy.findByRole('button', { name: 'Cancel' }).should('be.disabled')
  })
})
