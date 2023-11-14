import { FileDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileDownloadOptions'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { FileType } from '../../../../../../../../../../src/files/domain/models/File'
import { FileTabularDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileTabularDownloadOptions'

const fileNonTabular = FileMother.create({
  tabularData: undefined,
  type: new FileType('text/plain')
})
const fileTabular = FileMother.createWithTabularData()
const fileTabularUnknown = FileMother.createWithTabularData({
  type: new FileType('text/tab-separated-values', 'Unknown')
})
describe('FileTabularDownloadOptions', () => {
  it('renders the download options for a tabular file', () => {
    cy.customMount(<FileTabularDownloadOptions file={fileTabular} />)

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' }).should(
      'exist'
    )
    cy.findByRole('button', { name: 'Tab-Delimited' }).should('exist')
  })

  it('renders the download options for a tabular file of unknown original type', () => {
    cy.customMount(<FileDownloadOptions file={fileTabularUnknown} />)

    cy.findByRole('button', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('button', { name: 'Tab-Delimited' }).should('exist')
  })

  it('does not render the download options for a non-tabular file', () => {
    cy.customMount(<FileTabularDownloadOptions file={fileNonTabular} />)

    cy.findByRole('button', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('button', { name: 'Tab-Delimited' }).should('not.exist')
  })
})
