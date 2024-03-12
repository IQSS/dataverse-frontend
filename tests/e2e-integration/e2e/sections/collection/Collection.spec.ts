import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { TestsUtils } from '../../../shared/TestsUtils'
import { faker } from '@faker-js/faker'

describe('Collection Page', () => {
  const title = faker.lorem.sentence()
  before(() => {
    TestsUtils.setup()
    TestsUtils.login()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('successfully loads root collection when accessing the home', () => {
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

      cy.findAllByText(title).should('be.visible')
    })
  })

  it('log in Dataverse Admin user', () => {
    cy.visit('/spa')

    cy.findAllByText(/Root/i).should('exist')
    cy.findByText(/Dataverse Admin/i).should('exist')
  })

  it('finds the "Add Data" buttons', () => {
    cy.visit('/spa')

    cy.get('nav.navbar').within(() => {
      const addDataBtn = cy.findByRole('button', { name: /Add Data/i })
      addDataBtn.should('exist')
      addDataBtn.click({ force: true })
      cy.findByText('New Collection').should('be.visible')
      cy.findByText('New Dataset').should('be.visible')
    })

    cy.get('main').within(() => {
      const addDataBtn = cy.findByRole('button', { name: /Add Data/i })
      addDataBtn.should('exist')
      addDataBtn.click({ force: true })
      cy.findByText('New Collection').should('be.visible')
      cy.findByText('New Dataset').should('be.visible')
    })
  })

  it('Navigates to Create Dataset page when New Dataset link clicked', () => {
    cy.visit('/spa')

    cy.get('nav.navbar').within(() => {
      const addDataBtn = cy.findByRole('button', { name: /Add Data/i })
      addDataBtn.should('exist')
      addDataBtn.click({ force: true })
      cy.findByText('New Dataset').should('be.visible').click({ force: true })
    })
    cy.wait(1000)
    cy.findByText(/Create Dataset/i).should('exist')

    cy.visit('/spa')
    cy.wait(1000)
    cy.get('main').within(() => {
      const addDataBtn = cy.findByRole('button', { name: /Add Data/i })
      addDataBtn.should('exist')
      addDataBtn.click({ force: true })
      cy.findByText('New Dataset').should('be.visible').click({ force: true })
    })
    cy.wait(1000)
    cy.findByText(/Create Dataset/i).should('exist')
  })

  it('log out Dataverse Admin user', () => {
    cy.visit('/spa')
    cy.findAllByText(/Root/i).should('exist')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('button', { name: /Log Out/i }).click()
    cy.findByText(/Dataverse Admin/i).should('not.exist')
  })
  it('does not display the Add Data buttons when logged out', () => {
    cy.visit('/spa')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('button', { name: /Log Out/i }).click()

    cy.get('nav.navbar').within(() => {
      cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
    })

    cy.get('main').within(() => {
      cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
    })
  })

  // Skipped because for now we are just rendering infinite scrollable container, refactor if we add toggle button to switch between pagination and infinite scroll
  it.skip('displays the correct page of the datasets list when passing the page query param', () => {
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
  // Skipped because for now we are just rendering infinite scrollable container, refactor if we add toggle button to switch between pagination and infinite scroll
  it.skip('updates the query param when updateQueryParam is true', () => {
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
  // Skipped because for now we are just rendering infinite scrollable container, refactor if we add toggle button to switch between pagination and infinite scroll
  it.skip('correctly changes the pages when using the back and forward buttons from the browser after using some page number button', () => {
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

  it('displays a collection different from the root when accessing a subcollection', () => {
    cy.visit('/spa/collections?id=subcollection')

    cy.findAllByText(/Subcollection/i).should('exist')
    cy.findByText(/Dataverse Admin/i).should('exist')
  })

  it('4 Datasets - displays only 4 datasets and no more loading when scrolling to bottom', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(4)),
      { timeout: 10_000 }
    ).then(() => {
      cy.visit('/spa')

      cy.findAllByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByText('4 Datasets').should('exist')
      cy.get('[data-testid="scrollable-container"]').scrollTo('bottom', { ensureScrollable: false })
      cy.wait(1_500)
      cy.findByText('4 Datasets').should('exist')
    })
  })

  it('12 Datasets - displays first 10 datasets when more than 10 datasets', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(12)),
      { timeout: 10_000 }
    ).then(() => {
      cy.visit('/spa')

      cy.findAllByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByText('10 of 12 Datasets seen').should('exist')
    })
  })

  it('12 Datasets - displays first 10 datasets, scroll to the bottom and displays the remaining 2 datasets', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(12)),
      { timeout: 10_000 }
    ).then(() => {
      cy.wait(1_500)
      cy.visit('/spa')

      cy.findAllByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByText('10 of 12 Datasets seen').should('exist')

      cy.get('[data-testid="scrollable-container"]').scrollTo('bottom')
      cy.wait(1_500)
      cy.findByText('12 of 12 Datasets seen').should('exist')
    })
  })

  it('25 Datasets - displays first 10 datasets, scroll to the bottom and displays the next 10 datasets, scroll again and display remaining 5 datasets', () => {
    cy.wrap(
      DatasetHelper.destroyAll().then(() => DatasetHelper.createMany(25)),
      { timeout: 20_000 }
    ).then(() => {
      cy.wait(3_000)
      cy.visit('/spa')

      cy.findAllByText(/Root/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')

      cy.findByText('10 of 25 Datasets seen').should('exist')

      cy.get('[data-testid="scrollable-container"]').scrollTo('bottom')
      cy.wait(1_500)
      cy.findByText('20 of 25 Datasets seen').should('exist')

      cy.get('[data-testid="scrollable-container"]').scrollTo('bottom')
      cy.wait(1_500)
      cy.findByText('25 of 25 Datasets seen').should('exist')
    })
  })
})
