import { FileCriteriaSearchText } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-form/FileCriteriaSearchText'
import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'

const defaultCriteria = new FileCriteria()

describe('FilesSearch', () => {
  it('renders the search input', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')
    cy.customMount(
      <FileCriteriaSearchText criteria={defaultCriteria} onCriteriaChange={onCriteriaChange} />
    )

    cy.findByLabelText('Search this dataset').should('exist')
    cy.findByRole('button', { name: 'Submit search' }).should('exist')
  })

  it('calls onCriteriaChange with the searchText value on enter', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaSearchText criteria={defaultCriteria} onCriteriaChange={onCriteriaChange} />
    )

    cy.findByLabelText('Search this dataset').type('test{enter}')
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withSearchText('test'))
  })

  it('calls onCriteriaChange with the searchText value on submit', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaSearchText criteria={defaultCriteria} onCriteriaChange={onCriteriaChange} />
    )

    cy.findByLabelText('Search this dataset').type('test')
    cy.findByRole('button', { name: 'Submit search' }).click()
    cy.wrap(onCriteriaChange).should('be.calledWith', defaultCriteria.withSearchText('test'))
  })
})
