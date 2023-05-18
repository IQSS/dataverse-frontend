import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetCitation } from '../../../../../src/sections/dataset/dataset-citation/DatasetCitation'
import { ThemeProvider } from 'dataverse-design-system'
import { Citation, CitationStatus } from '../../../../../src/dataset/domain/models/Dataset'

describe('DatasetCitation', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetCitation fields', () => {
    const citationFields: Citation = {
      value:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms", [https://doi.org/10.70122/FK2/KLX4XO](https://doi.org/10.70122/FK2/KLX4XO), Demo Dataverse',
      status: CitationStatus.PUBLISHED,
      version: 'V1'
    }
    // TODO: remove ThemeProvider and replace with customMount()
    cy.mount(
      <ThemeProvider>
        <DatasetCitation citation={citationFields} />
      </ThemeProvider>
    )

    cy.findByText('Data Citation Standards.').should('exist')
    cy.findByText(new RegExp(`${citationFields.value}`)).should('exist')
    if (citationFields.version) {
      cy.findByText(new RegExp(`${citationFields.version}`)).should('exist')
    }
    cy.findByRole('link', { name: 'Data Citation Standards.' })
      .should('have.attr', 'href')
      .and('eq', 'https://dataverse.org/best-practices/data-citation')
    cy.findByRole('article').should('exist')
    cy.findByText(/DEACCESSIONED VERSION/).should('not.exist')
  })
  it('renders Deaccession information', () => {
    const deaccessionedCitation: Citation = {
      value:
        'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms", [https://doi.org/10.70122/FK2/KLX4XO](https://doi.org/10.70122/FK2/KLX4XO), Demo Dataverse',
      version: 'V1',
      status: CitationStatus.DEACCESSIONED
    }
    cy.mount(
      <ThemeProvider>
        <DatasetCitation citation={deaccessionedCitation} />
      </ThemeProvider>
    )

    cy.findByText(/DEACCESSIONED VERSION/).should('exist')
  })
})
