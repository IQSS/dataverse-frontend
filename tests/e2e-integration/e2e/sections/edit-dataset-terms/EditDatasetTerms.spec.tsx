import { faker } from '@faker-js/faker'
import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetNonNumericVersionSearchParam } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { QueryParamKey, Route } from '../../../../../src/sections/Route.enum'

describe('Edit Dataset Terms', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      cy.wrap(TestsUtils.setup(token))
    })
  })

  describe('Dataset Terms Tab', () => {
    it('visits the Edit Dataset Terms page and interacts with Dataset Terms tab', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        cy.findByRole('link', { name: 'Root' })
          .closest('.breadcrumb')
          .within(() => {
            cy.findByRole('link', { name: datasetTitle }).should('exist')
            cy.findByText('Edit Dataset Terms and Guestbook').should('exist')
          })

        cy.findByText('Edit Dataset Terms').should('exist')
        cy.findByText(
          /Add the terms of use for this dataset to explain how to access and use your data./i
        ).should('exist')

        cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')

        cy.get('select').should('exist')
        cy.get('select option').should('contain.text', 'Custom Dataset Terms')

        cy.get('select').select('Custom Dataset Terms')

        cy.findByTestId('customTerms.termsOfUse').should('exist')
        cy.findByTestId('customTerms.confidentialityDeclaration').should('exist')

        cy.findByTestId('customTerms.termsOfUse').type('These are custom terms for this dataset')

        cy.findByRole('button', { name: 'Save Changes' }).click()

        cy.findByText(/The license for this dataset has been updated./i).should('exist')

        const datasetPage =
          `datasets?${QueryParamKey.PERSISTENT_ID}=${dataset.persistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
            .replace(':', '%3A')
            .replace(/\//g, '%2F')

        cy.url().should('include', datasetPage)
      })
    })
  })

  describe('Restricted Files Tab', () => {
    it('visits the Restricted Files + Terms of Access tab and interacts with form', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
        searchParams.set('tab', 'restrictedFilesTerms')

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
          'have.attr',
          'aria-selected',
          'true'
        )

        cy.findByText('Request Access').should('exist')
        cy.findByLabelText('Enable access request').should('exist')

        cy.findByLabelText('Enable access request').check()

        cy.findByText(/Restricting limits access to published files/).should('exist')

        cy.findByLabelText('Terms of Access for Restricted Files').should('exist')
        cy.findByLabelText('Data Access Place').should('exist')
        cy.findByLabelText('Original Archive').should('exist')
        cy.findByLabelText('Availability Status').should('exist')
        cy.findByLabelText('Contact for Access').should('exist')
        cy.findByLabelText('Size of Collection').should('exist')
        cy.findByLabelText('Study Completion').should('exist')

        cy.findByLabelText('Terms of Access for Restricted Files').type(
          'Please contact the data owner for access to restricted files.'
        )

        cy.findByLabelText('Data Access Place').type(
          'Data can be accessed through the university data center.'
        )

        cy.findByLabelText('Contact for Access').type('dataowner@university.edu')

        cy.findByLabelText('Size of Collection').type('500 MB')

        cy.findByRole('button', { name: 'Save Changes' }).click()
        cy.findByRole('button', { name: 'Cancel' }).click()

        cy.findByRole('tab', { name: 'Terms and Guestbook' }).click()
        cy.findByText(/Data can be accessed through the university data center/i).should('exist')
        cy.findByText(/dataowner@university.edu/i).should('exist')
        cy.findByText(/500 MB/i).should('exist')
      })
    })

    it('preserves form data when switching tabs', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        cy.get('select').select('Custom Dataset Terms')
        cy.findByTestId('customTerms.termsOfUse').type('Custom terms text')
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()

        cy.findByRole('button', { name: /Leave without saving/i })
          .should('exist')
          .click()

        cy.findByLabelText('Enable access request').check()
        cy.findByLabelText('Terms of Access for Restricted Files').type('Restricted access terms')

        cy.findByRole('tab', { name: 'Dataset Terms' }).click()

        cy.findByRole('button', { name: /Leave without saving/i })
          .should('exist')
          .click()

        cy.get('select').should('have.value', 'CUSTOM')
        cy.findByTestId('customTerms.termsOfUse').should('have.value', 'Custom terms text')

        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()

        cy.findByLabelText('Enable access request').should('be.checked')
        cy.findByDisplayValue('Restricted access terms').should('exist')
      })
    })
  })

  describe('Navigation and URL handling', () => {
    it('handles direct navigation to specific tabs via URL parameters', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)
        searchParams.set('tab', 'restrictedFilesTerms')

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
          'have.attr',
          'aria-selected',
          'true'
        )
        cy.findByLabelText('Enable access request').should('exist')
      })
    })

    it('handles navigation back to dataset page', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)
        cy.findByRole('link', { name: datasetTitle }).click()

        cy.url().should('include', '/datasets')
        cy.findByRole('heading', { name: datasetTitle }).should('exist')
      })
    })
  })
})
