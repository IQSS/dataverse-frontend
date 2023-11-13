import { FileDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileDownloadOptions'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import { FileType } from '../../../../../../../../../../src/files/domain/models/File'

const fileNonTabular = FileMother.create({
  tabularData: undefined,
  type: new FileType('text/plain')
})
const fileNonTabularUnknown = FileMother.create({
  tabularData: undefined,
  type: new FileType('unknown')
})
const fileTabular = FileMother.createWithTabularData()
const fileTabularUnknown = FileMother.createWithTabularData({
  type: new FileType('text/tab-separated-values', 'Unknown')
})
describe('FileDownloadOptions', () => {
  it('renders the download options header', () => {
    cy.customMount(<FileDownloadOptions file={fileNonTabular} />)

    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })

  it('renders the download options for a non-tabular file of unknown type', () => {
    cy.customMount(<FileDownloadOptions file={fileNonTabularUnknown} />)

    cy.findByRole('button', { name: 'Original File Format' }).should('exist')
  })

  it('renders the download options for a non-tabular file', () => {
    cy.customMount(<FileDownloadOptions file={fileNonTabular} />)

    cy.findByRole('button', { name: 'Plain Text' }).should('exist')
  })

  it('renders the download options for a tabular file', () => {
    cy.customMount(<FileDownloadOptions file={fileTabular} />)

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' }).should(
      'exist'
    )
  })

  it('renders the download options for a tabular file of unknown original type', () => {
    cy.customMount(<FileDownloadOptions file={fileTabularUnknown} />)

    cy.findByRole('button', { name: /(Original File Format)/ }).should('not.exist')
  })
})
