import { FileCriteriaControls } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-controls/FileCriteriaControls'
import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../../files/domain/models/FilesCountInfoMother'

describe('FileCriteriaInputs', () => {
  it('renders the SortBy input', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaControls
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={FilesCountInfoMother.create()}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).should('exist')
  })

  it('renders the Filters input', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    const filesCountInfo = FilesCountInfoMother.create()

    cy.customMount(
      <FileCriteriaControls
        criteria={new FileCriteria()}
        onCriteriaChange={onCriteriaChange}
        filesCountInfo={filesCountInfo}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: All' }).should('exist')
    cy.findByText('Filter by').should('exist')
  })
})
