import { FileVersions } from '../../../../../src/sections/file/file-version/FileVersions'
import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetVersionState } from '@iqss/dataverse-client-javascript'

const file = FileMother.createFileVersionSummary()

describe('FileVersions', () => {
  it('renders version rows and metadata correctly', () => {
    cy.customMount(<FileVersions version={file} datasetVersionNumber={'2.0'} />)

    cy.contains('Version').should('exist')
    cy.contains('Summary').should('exist')
    cy.contains('Contributors').should('exist')
    cy.contains('Published On').should('exist')

    cy.get('strong').contains('2.0')
    cy.get('button').contains('1.0')

    cy.contains('File Added')
    cy.contains('Unrestricted')
    cy.contains('File Title Added')
    cy.contains('1 Added')
    cy.contains('1 Deleted')
  })

  it('disables the button for deaccessioned versions', () => {
    const deaccessionedFile = [
      {
        ...file[0],
        datasetVersion: '1.2',
        versionState: DatasetVersionState.DEACCESSIONED
      }
    ]
    cy.customMount(<FileVersions version={deaccessionedFile} datasetVersionNumber={'2.0'} />)

    cy.get('button').should('be.disabled')
  })

  it('disables the button when fileDifferenceSummary is missing and shows correct message', () => {
    const noSummaryFile = [
      {
        ...file[0],
        datasetVersion: '1.3',
        fileDifferenceSummary: undefined,
        versionState: DatasetVersionState.RELEASED
      }
    ]

    cy.customMount(<FileVersions version={noSummaryFile} datasetVersionNumber={'2.0'} />)

    cy.get('button').contains('1.3').should('be.disabled')
    cy.findAllByText('No changes associated with this version').should('exist')
  })

  it('the version number should be disable and bold if it is the current version', () => {
    const currentFile = [
      {
        ...file[0],
        datasetVersion: '2.0'
      }
    ]

    cy.customMount(<FileVersions version={currentFile} datasetVersionNumber={'2.0'} />)

    cy.get('strong').contains('2.0')
  })
})
