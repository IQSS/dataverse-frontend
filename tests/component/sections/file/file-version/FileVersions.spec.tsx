import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileVersions } from '../../../../../src/sections/file/file-version/FileVersions'
import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { FileVersionPaginationInfo } from '@/files/domain/models/FileVersionPaginationInfo'
import { FileVersionSummarySubset } from '@/files/domain/models/FileVersionSummaryInfo'

const fileVersionSummaries = FileMother.createFileVersionSummary()
const fileVersionSummariesSubset = {
  summaries: fileVersionSummaries,
  totalCount: fileVersionSummaries.length
}
const fileRepository: FileRepository = {} as FileRepository

describe('FileVersions', () => {
  it('renders version rows and metadata correctly', () => {
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummariesSubset)
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )

    cy.contains('Dataset Version').should('exist')
    cy.contains('Summary').should('exist')
    cy.contains('Contributors').should('exist')
    cy.contains('Published On').should('exist')

    cy.get('strong').contains('2.0')
    cy.findByTestId('file-version-link-1.0')
      .should('have.attr', 'href')
      .and(
        'include',
        `${Route.FILES}?${QueryParamKey.FILE_ID}=1&${QueryParamKey.DATASET_VERSION}=1.0`
      )

    cy.contains('File Added')
    cy.contains('Unrestricted')
    cy.contains('File Title Added')
    cy.contains('1 Added')
    cy.contains('1 Deleted')
  })

  it('should show the link button for deaccessioned versions', () => {
    const deaccessionedFile = [
      {
        ...fileVersionSummaries[0],
        datasetVersion: '1.2',
        versionState: DatasetVersionState.DEACCESSIONED
      }
    ]
    fileRepository.getFileVersionSummaries = cy
      .stub()
      .resolves({ summaries: deaccessionedFile, totalCount: deaccessionedFile.length })
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )

    cy.findByTestId('file-version-link-1.2')
      .should('have.attr', 'href')
      .and(
        'include',
        `${Route.FILES}?${QueryParamKey.FILE_ID}=1&${QueryParamKey.DATASET_VERSION}=1.2`
      )
  })

  it('disables the link button for deaccessioned versions without permission', () => {
    const deaccessionedFile = [
      {
        ...fileVersionSummaries[0],
        datasetVersion: '1.2',
        versionState: DatasetVersionState.DEACCESSIONED
      }
    ]
    fileRepository.getFileVersionSummaries = cy
      .stub()
      .resolves({ summaries: deaccessionedFile, totalCount: deaccessionedFile.length })
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={false}
        isInView
      />
    )

    cy.get('span').contains('1.2').should('exist')
    cy.findByTestId('file-version-link-1.2').should('not.exist')
  })

  it('disables the link button for draft version without permission', () => {
    const draftFile = [
      {
        ...fileVersionSummaries[0],
        datasetVersion: 'DRAFT',
        versionState: DatasetVersionState.DRAFT
      }
    ]
    fileRepository.getFileVersionSummaries = cy
      .stub()
      .resolves({ summaries: draftFile, totalCount: draftFile.length })
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={false}
        isInView
      />
    )

    cy.get('span').contains('DRAFT').should('exist')
  })

  it('disables the link button for version without datafileId', () => {
    const file = {
      summaries: [{ ...fileVersionSummaries[0], datafileId: undefined }],
      totalCount: 1
    }
    fileRepository.getFileVersionSummaries = cy.stub().resolves(file)
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )
    cy.findByText('2.0').should('exist')
    cy.findByTestId('file-version-link-2.0').should('not.exist')
  })

  it('disables the link button for version with empty fileDifferenceSummary', () => {
    const file = {
      summaries: [{ ...fileVersionSummaries[0], fileDifferenceSummary: {}, datafileId: 1 }],
      totalCount: 1
    }
    fileRepository.getFileVersionSummaries = cy.stub().resolves(file)
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )
    cy.findByText('2.0').should('exist')
    cy.findByTestId('file-version-link-2.0').should('not.exist')
  })

  it('the version number should be disable and bold if it is the current version', () => {
    const currentFile = [{ ...fileVersionSummaries[0], datasetVersion: '2.0' }]

    fileRepository.getFileVersionSummaries = cy
      .stub()
      .resolves({ summaries: currentFile, totalCount: currentFile.length })
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )
    cy.get('strong').contains('2.0')
  })

  it('returns correctly when summary is empty', () => {
    const file = {
      summaries: [{ ...fileVersionSummaries[0], fileDifferenceSummary: {}, datafileId: 1 }],
      totalCount: 1
    }
    fileRepository.getFileVersionSummaries = cy.stub().resolves(file)
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )
    cy.findByText('No changes associated with this version.').should('exist')
  })

  it('returns correctly when datafileId is undefined', () => {
    const file = {
      summaries: [{ ...fileVersionSummaries[0], datafileId: undefined }],
      totalCount: 1
    }
    fileRepository.getFileVersionSummaries = cy.stub().resolves(file)
    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'2.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )
    cy.contains('File not included in this version.').should('exist')
  })

  it('fetches file versions with pagination when changing pages', () => {
    const paginatedVersions = Array.from({ length: 11 }, (_, index) => ({
      ...fileVersionSummaries[0],
      datafileId: index + 1,
      datasetVersion: `${11 - index}.0`
    }))
    const getFileVersionSummariesStub = cy
      .stub()
      .callsFake(
        (
          _fileId: number,
          paginationInfo: FileVersionPaginationInfo
        ): Promise<FileVersionSummarySubset> => {
          const start = paginationInfo.offset
          return Promise.resolve({
            summaries: paginatedVersions.slice(start, start + paginationInfo.pageSize),
            totalCount: paginatedVersions.length
          })
        }
      )
    fileRepository.getFileVersionSummaries = getFileVersionSummariesStub

    cy.customMount(
      <FileVersions
        fileId={1}
        datasetVersionNumber={'11.0'}
        fileRepository={fileRepository}
        canEditOwnerDataset={true}
        isInView
      />
    )

    cy.wrap(getFileVersionSummariesStub).should(() => {
      const firstCallPaginationInfo = getFileVersionSummariesStub.getCall(0)
        .args[1] as FileVersionPaginationInfo
      expect(firstCallPaginationInfo.page).to.equal(1)
      expect(firstCallPaginationInfo.pageSize).to.equal(10)
      expect(firstCallPaginationInfo.offset).to.equal(0)
    })

    cy.findByRole('button', { name: 'Next' }).click()

    cy.wrap(getFileVersionSummariesStub).should(() => {
      const secondCallPaginationInfo = getFileVersionSummariesStub.getCall(1)
        .args[1] as FileVersionPaginationInfo
      expect(secondCallPaginationInfo.page).to.equal(2)
      expect(secondCallPaginationInfo.pageSize).to.equal(10)
      expect(secondCallPaginationInfo.offset).to.equal(10)
    })
    cy.findByText('1.0').should('exist')
    cy.findByText('11.0').should('not.exist')
  })
})
