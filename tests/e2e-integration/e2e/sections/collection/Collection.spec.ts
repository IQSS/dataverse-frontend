import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { TestsUtils } from '../../../shared/TestsUtils'
import { faker } from '@faker-js/faker'
import { CollectionHelper } from '../../../shared/collection/CollectionHelper'

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

  describe.skip('Currently skipping all tests as we are only rendering an infinite scrollable container. Please refactor these tests if a toggle button is added to switch between pagination and infinite scroll.', () => {
    it('navigates to the correct page of the datasets list when passing the page query param', () => {
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

    it('updates the page query param when navigating to another page', () => {
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

  it('displays a collection different from the root when accessing a subcollection', () => {
    cy.wrap(CollectionHelper.create('collection-1')).then(() => {
      cy.visit('/spa/collections?id=collection-1')

      cy.findAllByText(/Scientific Research/i).should('exist')
      cy.findByText(/Dataverse Admin/i).should('exist')
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

      cy.get('[data-testid="scrollable-container"]').scrollTo('bottom', { ensureScrollable: false })
      cy.wait(1_500)
      cy.findByText('12 of 12 Datasets seen').should('exist')
    })
  })
})
