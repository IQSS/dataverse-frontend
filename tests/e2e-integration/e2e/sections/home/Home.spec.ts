import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { TestsUtils } from '../../../shared/TestsUtils'
import { faker } from '@faker-js/faker'

describe('Home Page', () => {
  const title = faker.lorem.sentence()
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {})
  it('successfully loads', () => {
    cy.visit('/spa')
    cy.findAllByText(/Root/i).should('exist')
  })

  it('goes to dataset page', () => {
    cy.loginAsAdmin('/spa')
    DatasetHelper.destroyAll()
    DatasetHelper.createWithTitle(title)
    cy.findByText(title).should('be.visible')
    cy.findByText(title).click({ force: true })
    cy.url().should('include', 'persistentId')
    cy.findAllByText(title).should('be.visible')
  })

  it('log in Dataverse Admin user', () => {
    cy.loginAsAdmin('/spa')

    cy.findAllByText(/Root/i).should('exist')
    cy.findByText(/Dataverse Admin/i).should('exist')
  })

  it('log out Dataverse Admin user', () => {
    cy.loginAsAdmin('/spa')

    cy.findAllByText(/Root/i).should('exist')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('button', { name: /Log Out/i }).click()
    cy.findByText(/Dataverse Admin/i).should('not.exist')
  })
})
