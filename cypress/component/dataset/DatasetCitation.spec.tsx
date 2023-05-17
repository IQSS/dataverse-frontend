import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetCitation } from '../../../src/sections/dataset/datasetCitation/DatasetCitation'
import { ThemeProvider } from '../../../src/sections/ui/theme/ThemeProvider'
import { Citation } from '../../../src/dataset/domain/models/Dataset'

describe('DatasetCitation', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetCitation fields', () => {
    const citationFields: Citation = {
      authors: ['Bennet, Elizabeth', 'Darcy, Fitzwilliam'],
      title: 'Test Terms',
      creationYear: 2023,
      persistentIdentifier: 'https://doi.org/10.70122/FK2/KLX4XO',
      persistentIdentifierUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      version: 'V1'
    }
    // TODO: remove ThemeProvider and replace with customMount()
    cy.mount(
      <ThemeProvider>
        <DatasetCitation citation={citationFields} />
      </ThemeProvider>
    )
    citationFields.authors.map((author) => {
      cy.findByText(new RegExp(`${author}`)).should('exist')
    })
    cy.findByText('Data Citation Standards.').should('exist')
    cy.findByText(new RegExp(`${citationFields.title}`)).should('exist')
    cy.findByText(new RegExp(`${citationFields.creationYear}`)).should('exist')
    cy.findByText(new RegExp(`${citationFields.publisher}`)).should('exist')
    cy.findByText(new RegExp(`${citationFields.version}`)).should('exist')
    cy.findByRole('link', { name: citationFields.persistentIdentifier })
      .should('have.attr', 'href')
      .and('eq', citationFields.persistentIdentifierUrl)

    cy.findByRole('link', { name: 'Data Citation Standards.' })
      .should('have.attr', 'href')
      .and('eq', 'https://dataverse.org/best-practices/data-citation')
    cy.findByRole('article').should('exist')
    cy.findByText(/DEACCESSIONED VERSION/).should('not.exist')
  })
})
