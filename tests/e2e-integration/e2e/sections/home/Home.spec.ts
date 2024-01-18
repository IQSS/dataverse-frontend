import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { TestsUtils } from '../../../shared/TestsUtils'
import { faker } from '@faker-js/faker'

describe('Home Page', () => {
  const title = faker.lorem.sentence()
  before(() => {
    TestsUtils.setup()
    TestsUtils.login()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('successfully loads', () => {
    cy.visit('/spa')
    cy.findAllByText(/Root/i).should('exist')
  })

  it('navigates to a dataset from the list when clicking the title', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createWithTitle(title)),
      { timeout: 6000 }
    ).then(() => {
      cy.visit('/spa')

      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByText(title).should('be.visible')
      cy.findByText(title).click({ force: true })

      cy.url().should('include', 'persistentId')
      cy.findAllByText(title).should('be.visible')
    })
  })

  it('log in Dataverse Admin user', () => {
    cy.visit('/spa')

    cy.findAllByText(/Root/i).should('exist')
    cy.findByText(/Dataverse Admin/i).should('exist')
  })

  it('log out Dataverse Admin user', () => {
    cy.visit('/spa')

    cy.findAllByText(/Root/i).should('exist')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('button', { name: /Log Out/i }).click()
    cy.findByText(/Dataverse Admin/i).should('not.exist')
  })

  it('displays the correct page of the datasets list when passing the page query param', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(12)),
      { timeout: 6000 }
    ).then(() => {
      cy.visit('/spa?page=2')

      cy.findByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByText('11 to 12 of 12 Datasets').should('exist')
    })
  })

  it('updates the query param when updateQueryParam is true', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(12)),
      { timeout: 6000 }
    ).then(() => {
      cy.visit('/spa')

      cy.findByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByText('11 to 12 of 12 Datasets').should('exist')
      cy.location('search').should('eq', '?page=2')
    })
  })
})
