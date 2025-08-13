import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { FileVersions } from '../../../../../src/sections/file/file-version/FileVersions'
import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'
import { QueryParamKey, Route } from '@/sections/Route.enum'

const fileVersionSummaries = FileMother.createFileVersionSummary()
const fileRepository: FileRepository = {} as FileRepository

describe('FileVersions', () => {
  it('renders version rows and metadata correctly', () => {
    fileRepository.getFileVersionSummaries = cy.stub().resolves(fileVersionSummaries)
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
    fileRepository.getFileVersionSummaries = cy.stub().resolves(deaccessionedFile)
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
    fileRepository.getFileVersionSummaries = cy.stub().resolves(deaccessionedFile)
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
    fileRepository.getFileVersionSummaries = cy.stub().resolves(draftFile)
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

  it('the version number should be disable and bold if it is the current version', () => {
    const currentFile = [{ ...fileVersionSummaries[0], datasetVersion: '2.0' }]

    fileRepository.getFileVersionSummaries = cy.stub().resolves(currentFile)
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
})
