import { RowSelectionMessage } from '../../../../../../../src/sections/dataset/dataset-files/files-table/row-selection/RowSelectionMessage'
import { createRowSelection } from '../../../../../../../src/sections/dataset/dataset-files/files-table/useFilesTable'

let onRowSelectionChange = () => {}
describe('RowSelectionMessage', () => {
  beforeEach(() => {
    onRowSelectionChange = cy.stub().as('onRowSelectionChange')
  })

  it('renders the message when there are more than 10 files and some row is selected', () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={createRowSelection(1)}
        totalFilesCount={11}
        onRowSelectionChange={onRowSelectionChange}
      />
    )

    cy.findByText('1 file is currently selected.')
    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' })
    cy.findByRole('button', { name: 'Clear selection.' })
  })

  it('does not render the message when there are less than 10 files', () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={createRowSelection(1)}
        totalFilesCount={9}
        onRowSelectionChange={onRowSelectionChange}
      />
    )

    cy.findByText('1 file is currently selected.').should('not.exist')
    cy.findByRole('button', { name: 'Select all 9 files in this dataset.' }).should('not.exist')
    cy.findByRole('button', { name: 'Clear selection.' }).should('not.exist')
  })

  it('does not render the message when there are more than 10 files but no row is selected', () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={createRowSelection(0)}
        totalFilesCount={11}
        onRowSelectionChange={onRowSelectionChange}
      />
    )

    cy.findByText('1 file is currently selected.').should('not.exist')
    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' }).should('not.exist')
    cy.findByRole('button', { name: 'Clear selection.' }).should('not.exist')
  })

  it('renders the plural form of the message when there is more than 1 row selected', () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={createRowSelection(2)}
        totalFilesCount={11}
        onRowSelectionChange={onRowSelectionChange}
      />
    )

    cy.findByText('2 files are currently selected.')
  })

  it("calls onRowSelectionChange when the 'Select all' button is clicked", () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={createRowSelection(1)}
        totalFilesCount={11}
        onRowSelectionChange={onRowSelectionChange}
      />
    )

    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' }).click()

    cy.wrap(onRowSelectionChange).should('be.calledWith', createRowSelection(11))
  })

  it("calls setRowSelection when the 'Clear selection.' button is clicked", () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={createRowSelection(1)}
        totalFilesCount={11}
        onRowSelectionChange={onRowSelectionChange}
      />
    )

    cy.findByRole('button', { name: 'Clear selection.' }).click()

    cy.wrap(onRowSelectionChange).should('be.calledWith', createRowSelection(0))
  })
})
