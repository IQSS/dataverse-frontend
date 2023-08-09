import { FileActionButtons } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/FileActionButtons'
import { FileMother } from '../../../../../../../files/domain/models/FileMother'

const file = FileMother.create()
describe('FileActionButtons', () => {
  it('renders the file action buttons', () => {
    cy.customMount(<FileActionButtons file={file} />)

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
  })
})
