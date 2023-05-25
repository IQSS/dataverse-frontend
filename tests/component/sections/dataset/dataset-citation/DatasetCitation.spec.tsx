import { createSandbox, SinonSandbox } from 'sinon'
import { DatasetCitation } from '../../../../../src/sections/dataset/dataset-citation/DatasetCitation'
import { Citation, DatasetStatus } from '../../../../../src/dataset/domain/models/Dataset'

describe('DatasetCitation', () => {
  const sandbox: SinonSandbox = createSandbox()
  const citation: Citation = {
    citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
    pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
    publisher: 'Demo Dataverse'
  }
  afterEach(() => {
    sandbox.restore()
  })

  it('renders the DatasetCitation fields of Published Dataset', () => {
    const status = DatasetStatus.RELEASED
    const version = null
    cy.customMount(<DatasetCitation citation={citation} status={status} version={version} />)

    cy.findByText('Data Citation Standards.').should('exist')
    cy.findByText(/Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms"/).should('exist')
    cy.findByRole('link', { name: citation.pidUrl })
      .should('have.attr', 'href')
      .and('eq', citation.pidUrl)
    cy.findByRole('link', { name: 'Data Citation Standards.' })
      .should('have.attr', 'href')
      .and('eq', 'https://dataverse.org/best-practices/data-citation')
    cy.findByRole('article').should('exist')
    cy.findByText(/PUBLISHED/).should('not.exist')
  })

  it('renders Draft Dataset', () => {
    const status = DatasetStatus.DRAFT
    const version = null
    cy.customMount(<DatasetCitation citation={citation} status={status} version={version} />)

    cy.findByText(/DRAFT/).should('exist')
  })

  it('renders Deaccession Dataset', () => {
    const status = DatasetStatus.DEACCESSIONED
    const version = null
    cy.customMount(<DatasetCitation citation={citation} status={status} version={version} />)

    cy.findByText(/DEACCESSIONED VERSION/).should('exist')
  })
  it('renders version correctly', () => {
    const status = DatasetStatus.DEACCESSIONED
    const version = { majorNumber: 12, minorNumber: 3 }
    cy.customMount(<DatasetCitation citation={citation} status={status} version={version} />)

    cy.findByText(/V12/).should('be.visible')
  })
  it('renders null version correctly', () => {
    const status = DatasetStatus.DEACCESSIONED
    const version = null
    cy.customMount(<DatasetCitation citation={citation} status={status} version={version} />)
    cy.findByText(/V1/).should('not.exist')
  })

  it('renders with the unf property', () => {
    const status = DatasetStatus.RELEASED
    const version = null
    const citationWithUnf: Citation = {
      citationText: 'Bennet, Elizabeth; Darcy, Fitzwilliam, 2023, "Test Terms" ',
      pidUrl: 'https://doi.org/10.70122/FK2/KLX4XO',
      publisher: 'Demo Dataverse',
      unf: 'unf:123'
    }

    cy.customMount(<DatasetCitation citation={citationWithUnf} status={status} version={version} />)

    cy.findByText(/unf:123/).should('exist')
  })
})
