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
      { timeout: 10000 }
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
    cy.visit('/spa')

    cy.findAllByText(/Root/i).should('exist')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('button', { name: /Log Out/i }).click()
    cy.findByText(/Dataverse Admin/i).should('not.exist')
  })

  it('displays the correct page of the datasets list when passing the page query param', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(12)),
      { timeout: 10000 }
    ).then(() => {
      cy.visit('/spa?page=2')

      cy.findAllByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByText('11 to 12 of 12 Datasets').should('exist')
    })
  })

  it('updates the query param when updateQueryParam is true', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(12)),
      { timeout: 10000 }
    ).then(() => {
      cy.visit('/spa')

      cy.findAllByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByRole('button', { name: 'Next' }).click()
      cy.findByText('11 to 12 of 12 Datasets').should('exist')
      cy.location('search').should('eq', '?page=2')
    })
  })

  it('correctly changes the pages when using the back and forward buttons from the browser after using some page number button', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(12)),
      { timeout: 10000 }
    ).then(() => {
      cy.visit('/spa?page=2')

      cy.findAllByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')
      cy.findByText('11 to 12 of 12 Datasets').should('exist')

      cy.wait(1000)

      cy.findByRole('button', { name: '1' }).click({ force: true })
      cy.findByText('1 to 10 of 12 Datasets').should('exist')

      cy.wait(1000)

      cy.go('back')
      cy.findByText('11 to 12 of 12 Datasets').should('exist')

      cy.wait(1000)

      cy.go('forward')
      cy.findByText('1 to 10 of 12 Datasets').should('exist')
    })
  })
})
