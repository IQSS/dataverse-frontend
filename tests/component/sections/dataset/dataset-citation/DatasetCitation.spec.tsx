import { DatasetCitation } from '../../../../../src/sections/dataset/dataset-citation/DatasetCitation'
import { DatasetMother } from '../../../dataset/domain/models/DatasetMother'

describe('DatasetCitation', () => {
  it('renders the DatasetCitation fields of released Dataset', () => {
    const dataset = DatasetMother.create()
    cy.customMount(<DatasetCitation citation={dataset.citation} version={dataset.version} />)

    cy.findByText('Data Citation Standards.').should('exist')
    cy.findByText(/Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title"/).should('exist')
    cy.findByRole('link', { name: 'https://doi.org/10.5072/FK2/BUDNRV' })
      .should('have.attr', 'href')
      .and('eq', 'https://doi.org/10.5072/FK2/BUDNRV')
    cy.findByRole('link', { name: 'Data Citation Standards.' })
      .should('have.attr', 'href')
      .and('eq', 'https://dataverse.org/best-practices/data-citation')
    cy.findByRole('article').should('exist')
    cy.findByText(/RELEASED/).should('not.exist')
    cy.findByText(/V1/).should('exist')
  })
})
