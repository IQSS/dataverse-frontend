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

  it('goes to dataset page from list', () => {
    void DatasetHelper.destroyAll()
    void DatasetHelper.createWithTitle(title)
    TestsUtils.login()
    cy.findByText(/Dataverse Admin/i).should('exist')
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

  it('finds the "Add Data" button', () => {
    cy.loginAsAdmin('/spa')

    const addDataBtnNav = cy.get('nav').findByRole('button', { name: /Add Data/i })
    addDataBtnNav.should('exist')
    addDataBtnNav.click()
    cy.get('nav').findByText('New Dataverse').should('be.visible')
    cy.get('nav').findByText('New Dataset').should('be.visible')

    cy.findByLabelText('Application Body').within(() => {
      cy.findByRole('button', { name: /Add Data/i }).should('exist')
    })
  })

  it('log out Dataverse Admin user', () => {
    cy.loginAsAdmin('/spa')

    cy.findAllByText(/Root/i).should('exist')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('button', { name: /Log Out/i }).click()
    cy.findByText(/Dataverse Admin/i).should('not.exist')
  })
})
