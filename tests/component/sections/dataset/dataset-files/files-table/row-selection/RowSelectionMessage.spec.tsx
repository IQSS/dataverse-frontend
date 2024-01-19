import { RowSelectionMessage } from '../../../../../../../src/sections/dataset/dataset-files/files-table/row-selection/RowSelectionMessage'
import { FilePreviewMother } from '../../../../../files/domain/models/FilePreviewMother'

let selectAllRows = () => {}
let clearRowSelection = () => {}
describe('RowSelectionMessage', () => {
  beforeEach(() => {
    selectAllRows = cy.stub().as('selectAllRows')
    clearRowSelection = cy.stub().as('clearRowSelection')
  })

  it('renders the message when there are more than 10 files and some row is selected', () => {
    cy.customMount(
      <RowSelectionMessage
        fileSelection={{ '1': FilePreviewMother.create() }}
        totalFilesCount={11}
        selectAllRows={selectAllRows}
        clearRowSelection={clearRowSelection}
      />
    )

    cy.findByText('1 file is currently selected.')
    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' })
    cy.findByRole('button', { name: 'Clear selection.' })
  })

  it('does not render the message when there are less than 10 files', () => {
    cy.customMount(
      <RowSelectionMessage
        fileSelection={{ '1': FilePreviewMother.create() }}
        totalFilesCount={9}
        selectAllRows={selectAllRows}
        clearRowSelection={clearRowSelection}
      />
    )

    cy.findByText('1 file is currently selected.').should('not.exist')
    cy.findByRole('button', { name: 'Select all 9 files in this dataset.' }).should('not.exist')
    cy.findByRole('button', { name: 'Clear selection.' }).should('not.exist')
  })

  it('does not render the message when there are more than 10 files but no row is selected', () => {
    cy.customMount(
      <RowSelectionMessage
        fileSelection={{}}
        totalFilesCount={11}
        selectAllRows={selectAllRows}
        clearRowSelection={clearRowSelection}
      />
    )

    cy.findByText('1 file is currently selected.').should('not.exist')
    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' }).should('not.exist')
    cy.findByRole('button', { name: 'Clear selection.' }).should('not.exist')
  })

  it('renders the plural form of the message when there is more than 1 row selected', () => {
    cy.customMount(
      <RowSelectionMessage
        fileSelection={{ '1': FilePreviewMother.create(), '2': FilePreviewMother.create() }}
        totalFilesCount={11}
        selectAllRows={selectAllRows}
        clearRowSelection={clearRowSelection}
      />
    )

    cy.findByText('2 files are currently selected.')
  })

  it("calls selectAllRows when the 'Select all' button is clicked", () => {
    cy.customMount(
      <RowSelectionMessage
        fileSelection={{ '1': FilePreviewMother.create() }}
        totalFilesCount={11}
        selectAllRows={selectAllRows}
        clearRowSelection={clearRowSelection}
      />
    )

    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' }).click()

    cy.wrap(selectAllRows).should('be.called')
  })

  it("calls clearRowSelection when the 'Clear selection.' button is clicked", () => {
    cy.customMount(
      <RowSelectionMessage
        fileSelection={{ '1': FilePreviewMother.create() }}
        totalFilesCount={11}
        selectAllRows={selectAllRows}
        clearRowSelection={clearRowSelection}
      />
    )

    cy.findByRole('button', { name: 'Clear selection.' }).click()

    cy.wrap(clearRowSelection).should('be.called')
  })
})
