import { FileDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileDownloadOptions'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { FileType } from '../../../../../../../../../../src/files/domain/models/File'
import { FileNonTabularDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileNonTabularDownloadOptions'

const fileNonTabular = FileMother.create({
  tabularData: undefined,
  type: new FileType('text/plain')
})
const fileNonTabularUnknown = FileMother.create({
  tabularData: undefined,
  type: new FileType('unknown')
})
const fileTabular = FileMother.createWithTabularData()
describe('FileNonTabularDownloadOptions', () => {
  it('renders the download options for a non-tabular file of unknown type', () => {
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabularUnknown} />)

    cy.findByRole('button', { name: 'Original File Format' }).should('exist')
  })

  it('renders the download options for a non-tabular file', () => {
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabular} />)

    cy.findByRole('button', { name: 'Plain Text' }).should('exist')
  })

  it('does not render the download options for a tabular file', () => {
    cy.customMount(<FileNonTabularDownloadOptions file={fileTabular} />)

    cy.findByRole('button', { name: 'Original File Format' }).should('not.exist')
    cy.findByRole('button', { name: 'Tab-Delimited' }).should('not.exist')
  })
})
