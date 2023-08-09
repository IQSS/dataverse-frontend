import { FileActionButtonAccessFile } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileActionButtonAccessFile'
import { FileMother } from '../../../../../../../files/domain/models/FileMother'

const file = FileMother.create()
describe('FileActionButtonAccessFile', () => {
  it('renders the file action button access file', () => {
    cy.customMount(<FileActionButtonAccessFile file={file} />)

    cy.findByRole('button', { name: 'Access File' }).should('exist')
  })

  it('renders the file action button access file with tooltip', () => {
    cy.customMount(<FileActionButtonAccessFile file={file} />)

    cy.findByRole('button', { name: 'Access File' }).trigger('mouseover')
    cy.findByRole('tooltip', { name: 'Access File' }).should('exist')
  })
})
