import { FileDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileDownloadOptions'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'

const file = FileMother.create()
describe('FileDownloadOptions', () => {
  it('renders the download options header', () => {
    cy.customMount(<FileDownloadOptions file={file} />)

    cy.findByRole('heading', { name: 'Download Options' }).should('exist')
  })
})
