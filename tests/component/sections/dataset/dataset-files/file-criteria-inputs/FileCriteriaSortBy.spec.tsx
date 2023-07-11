import { FileCriteriaSortBy } from '../../../../../../src/sections/dataset/dataset-files/file-criteria-inputs/FileCriteriaSortBy'
import {
  FileCriteria,
  FileSortByOption
} from '../../../../../../src/files/domain/models/FileCriteria'

const defaultCriteria = new FileCriteria()
describe('FilesCriteriaSortBy', () => {
  it('calls onCriteriaChange with the selected orderBy value', () => {
    const onCriteriaChange = cy.stub().as('onCriteriaChange')

    cy.customMount(
      <FileCriteriaSortBy criteria={defaultCriteria} onCriteriaChange={onCriteriaChange} />
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (A-Z)').should('exist').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withSortBy(FileSortByOption.NAME_AZ)
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (Z-A)').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withSortBy(FileSortByOption.NAME_ZA)
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Newest').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withSortBy(FileSortByOption.NEWEST)
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Oldest').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withSortBy(FileSortByOption.OLDEST)
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Size').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withSortBy(FileSortByOption.SIZE)
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Type').click()
    cy.wrap(onCriteriaChange).should(
      'be.calledWith',
      defaultCriteria.withSortBy(FileSortByOption.TYPE)
    )
  })
})
