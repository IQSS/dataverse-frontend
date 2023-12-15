import { DatasetCitation } from '../../../../../src/sections/dataset/dataset-citation/DatasetCitation'
import { DatasetMother, DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'

describe('DatasetCitation', () => {
  it('renders the DatasetCitation fields of released Dataset', () => {
    const dataset = DatasetMother.create()
    cy.customMount(<DatasetCitation title="Dataset title" version={dataset.version} />)

    cy.findByText('Data Citation Standards.').should('exist')
    cy.findByText(/Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Dataset Title"/).should('exist')
    cy.findByRole('link', { name: 'https://doi.org/10.5072/FK2/BUDNRV' })
      .should('have.attr', 'href')
      .and('eq', 'https://doi.org/10.5072/FK2/BUDNRV')
    cy.findByRole('link', { name: 'Data Citation Standards.' })
      .should('have.attr', 'href')
      .and('eq', 'https://dataverse.org/best-practices/data-citation')
    cy.findByText(/RELEASED/).should('not.exist')
    cy.findByText(/V1/).should('exist')
    cy.findByLabelText('icon-dataset').should('exist')
  })

  it('shows the draft tooltip when version is draft', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDraft()
    })
    cy.customMount(<DatasetCitation title="Dataset title" version={dataset.version} />)

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')
    cy.findByText(
      /DRAFT VERSION will be replaced in the citation with the selected version once the dataset has been published./
    ).should('exist')
  })

  it('shows the deaccessioned tooltip when version is deaccessioned', () => {
    const dataset = DatasetMother.create({
      version: DatasetVersionMother.createDeaccessioned()
    })
    cy.customMount(<DatasetCitation title="Dataset title" version={dataset.version} />)

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')
    cy.findByText(
      /DEACCESSIONED VERSION has been added to the citation for this version since it is no longer available./
    ).should('exist')
  })
})
