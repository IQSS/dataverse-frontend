import { RowSelectionMessage } from '../../../../../../../src/sections/dataset/dataset-files/files-table/row-selection/RowSelectionMessage'

describe('RowSelectionMessage', () => {
  it('renders the message when there are more than 10 files and some row is selected', () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={{
          '1': true
        }}
        filesTotalCount={11}
      />
    )

    cy.findByText('1 files are currently selected.')
    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' })
    cy.findByRole('button', { name: 'Clear selection' })
  })

  it('does not render the message when there are less than 10 files', () => {
    cy.customMount(
      <RowSelectionMessage
        rowSelection={{
          '1': true
        }}
        filesTotalCount={9}
      />
    )

    cy.findByText('1 files are currently selected.').should('not.exist')
    cy.findByRole('button', { name: 'Select all 9 files in this dataset.' }).should('not.exist')
    cy.findByRole('button', { name: 'Clear selection' }).should('not.exist')
  })

  it('does not render the message when there are more than 10 files but no row is selected', () => {
    cy.customMount(<RowSelectionMessage rowSelection={{}} filesTotalCount={11} />)

    cy.findByText('1 files are currently selected.').should('not.exist')
    cy.findByRole('button', { name: 'Select all 11 files in this dataset.' }).should('not.exist')
    cy.findByRole('button', { name: 'Clear selection' }).should('not.exist')
  })
})
