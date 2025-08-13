import { FileActionsCell } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/FileActionsCell'
import { FilePreviewMother } from '../../../../../../files/domain/models/FilePreviewMother'

const file = FilePreviewMother.create()
describe('FileActionsCell', () => {
  it('renders the file action buttons', () => {
    cy.customMount(<FileActionsCell file={file} />)

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
  })
})
