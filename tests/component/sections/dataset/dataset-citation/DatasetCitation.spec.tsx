import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetCitation } from '../../../../../src/sections/dataset/dataset-citation/DatasetCitation'
import {
  DatasetCitation as DatasetCitationModel,
  DatasetStatus,
  DatasetVersion
} from '../../../../../src/dataset/domain/models/Dataset'

describe('DatasetCitation', () => {
  const sandbox: SinonSandbox = createSandbox()
  const citation: DatasetCitationModel = {
    citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
    url: 'https://doi.org/10.70122/FK2/KLX4XO',
    publisher: 'Demo Dataverse'
  }

  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetCitation fields of Published Dataset', () => {
    const version = new DatasetVersion(1, 0, DatasetStatus.RELEASED)
    cy.customMount(<DatasetCitation citation={citation} version={version} />)

    cy.findByText('Data Citation Standards.').should('exist')
    cy.findByText(/Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms"/).should('exist')
    cy.findByRole('link', { name: citation.url })
      .should('have.attr', 'href')
      .and('eq', citation.url)
    cy.findByRole('link', { name: 'Data Citation Standards.' })
      .should('have.attr', 'href')
      .and('eq', 'https://dataverse.org/best-practices/data-citation')
    cy.findByRole('article').should('exist')
    cy.findByText(/RELEASED/).should('not.exist')
    cy.findByText(/V1/).should('exist')
  })

  it('renders Draft Dataset', () => {
    const version = new DatasetVersion(1, 0, DatasetStatus.DRAFT)
    cy.customMount(<DatasetCitation citation={citation} version={version} />)

    cy.findByText(/DRAFT/).should('exist')
    cy.findByText(/V1/).should('not.exist')
  })

  it('renders Deaccessioned Dataset', () => {
    const version = new DatasetVersion(1, 0, DatasetStatus.DEACCESSIONED)
    cy.customMount(<DatasetCitation citation={citation} version={version} />)

    cy.findByText(/DEACCESSIONED VERSION/).should('exist')
    cy.findByText(/V1/).should('exist')
  })
  it('renders version correctly', () => {
    const version = new DatasetVersion(12, 3, DatasetStatus.RELEASED)
    cy.customMount(<DatasetCitation citation={citation} version={version} />)

    cy.findByText(/V12/).should('exist')
  })

  it('renders with the unf property', () => {
    const version = new DatasetVersion(12, 3, DatasetStatus.RELEASED)
    const citationWithUnf: DatasetCitationModel = {
      citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
      url: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      unf: 'unf:123'
    }

    cy.customMount(<DatasetCitation citation={citationWithUnf} version={version} />)

    cy.findByText(/unf:123/).should('exist')
  })
})
