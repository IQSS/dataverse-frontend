import { FileActionsCell } from '../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/FileActionsCell'
import { FileMother } from '../../../../../../files/domain/models/FileMother'

const file = FileMother.create()
describe('FileActionsCell', () => {
  it('renders the file action buttons', () => {
    cy.customMount(<FileActionsCell file={file} />)

    cy.findByRole('group', { name: 'File Action Buttons' }).should('exist')
  })
})
