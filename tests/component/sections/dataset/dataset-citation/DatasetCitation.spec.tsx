import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { DatasetCitation } from '../../../../../src/sections/dataset/dataset-citation/DatasetCitation'
import { DatasetVersionMother } from '../../../dataset/domain/models/DatasetMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
describe('DatasetCitation', () => {
  it('renders the DatasetCitation fields of released Dataset', () => {
    const version = DatasetVersionMother.createRealistic()
    cy.customMount(
      <DatasetCitation version={version} datasetId="123" datasetRepository={datasetRepository} />
    )

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
    cy.findByLabelText('icon-dataset').should('exist')
  })

  it('shows the draft tooltip when version is draft', () => {
    const version = DatasetVersionMother.createDraft()
    cy.customMount(
      <DatasetCitation version={version} datasetId="123" datasetRepository={datasetRepository} />
    )

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')
    cy.findByText(
      /DRAFT VERSION will be replaced in the citation with the selected version once the dataset has been published./
    ).should('exist')
  })

  it('shows the deaccessioned tooltip when version is deaccessioned', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    cy.customMount(
      <DatasetCitation version={version} datasetId="123" datasetRepository={datasetRepository} />
    )

    cy.findByRole('img', { name: 'tooltip icon' }).should('exist').trigger('mouseover')
    cy.findByText(
      /DEACCESSIONED VERSION has been added to the citation for this version since it is no longer available./
    ).should('exist')
  })

  it('shows the deaccessioned reason when version is deaccessioned', () => {
    const version = DatasetVersionMother.createDeaccessioned()
    cy.customMount(
      <DatasetCitation version={version} datasetId="123" datasetRepository={datasetRepository} />
    )

    cy.findByText(/Deaccession Reason/).should('exist')
  })

  it('does not render the thumbnail when withoutThumbnail prop is true', () => {
    const version = DatasetVersionMother.createRealistic()
    cy.customMount(
      <DatasetCitation
        version={version}
        withoutThumbnail={true}
        datasetId="123"
        datasetRepository={datasetRepository}
      />
    )

    cy.findByLabelText('icon-dataset').should('not.exist')
  })

  it('renders the Cite Dataset button', () => {
    const version = DatasetVersionMother.createRealistic()
    cy.customMount(
      <DatasetCitation version={version} datasetId="123" datasetRepository={datasetRepository} />
    )

    cy.findByRole('button', { name: 'Cite Dataset' }).should('exist')
    cy.findByRole('button', { name: 'Cite Dataset' }).click()
    cy.findByText('Download EndNote XML').should('exist')
    cy.findByText('Download RIS').should('exist')
    cy.findByText('Download BibTeX').should('exist')
    cy.findByText('View Styled Citation').should('exist')
  })
})
