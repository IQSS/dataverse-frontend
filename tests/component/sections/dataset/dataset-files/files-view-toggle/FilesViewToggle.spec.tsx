import { useState } from 'react'
import {
  FilesViewToggle,
  FilesViewMode
} from '../../../../../../src/sections/dataset/dataset-files/files-view-toggle/FilesViewToggle'

function Harness({ initial }: { initial: FilesViewMode }) {
  const [view, setView] = useState<FilesViewMode>(initial)
  return (
    <>
      <FilesViewToggle view={view} onChange={setView} />
      <div data-testid="harness-current">{view}</div>
    </>
  )
}

describe('FilesViewToggle', () => {
  it('reflects the active view', () => {
    cy.customMount(<Harness initial="table" />)
    cy.findByTestId('files-view-toggle-table').should('have.attr', 'aria-selected', 'true')
    cy.findByTestId('files-view-toggle-tree').should('have.attr', 'aria-selected', 'false')
  })

  it('switches to tree view on click', () => {
    cy.customMount(<Harness initial="table" />)
    cy.findByTestId('files-view-toggle-tree').click()
    cy.findByTestId('harness-current').should('have.text', 'tree')
  })

  it('switches back to table view on click', () => {
    cy.customMount(<Harness initial="tree" />)
    cy.findByTestId('files-view-toggle-table').click()
    cy.findByTestId('harness-current').should('have.text', 'table')
  })
})
