import { faker } from '@faker-js/faker'
import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetNonNumericVersionSearchParam } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { QueryParamKey, Route } from '../../../../../src/sections/Route.enum'

describe('Edit Dataset Terms End-to-End', () => {
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

        // Check breadcrumbs
        cy.findByRole('link', { name: 'Root' })
          .closest('.breadcrumb')
          .within(() => {
            cy.findByRole('link', { name: datasetTitle }).should('exist')
            cy.findByText('Edit Dataset Terms and Guestbook').should('exist')
          })

        // Check info alert
        cy.findByText('Edit Dataset Terms').should('exist')
        cy.findByText(
          'Add the terms of use for this dataset to explain how to access and use your data.'
        ).should('exist')

        // Check that Dataset Terms tab is active by default
        cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'aria-selected', 'true')

        // Check license dropdown exists
        cy.get('select').should('exist')
        cy.get('select option').should('contain.text', 'Custom Dataset Terms')

        // Test license selection
        cy.get('select').select('Custom Dataset Terms')

        // Custom terms fields should appear
        cy.findByLabelText('Terms of Use').should('exist')
        cy.findByLabelText('Confidentiality Declaration').should('exist')

        // Fill in required custom terms
        cy.findByLabelText('Terms of Use').type('These are custom terms for this dataset')

        // Save button should be enabled
        cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')

        // Test cancel functionality
        cy.findByRole('button', { name: 'Cancel' }).click()

        // Should reset to default license
        cy.get('select').should('not.have.value', 'CUSTOM')
      })
    })

    it('validates custom terms requirement', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        // Select custom terms
        cy.get('select').select('Custom Dataset Terms')

        // Try to save without filling required field
        cy.findByRole('button', { name: 'Save Changes' }).click()

        // Should show validation error
        cy.findByText('Terms of Use is required.').should('exist')
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
        searchParams.set('tab', 'restrictedFilesTerms') // Start with restricted files tab

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        // Switch to restricted files tab
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
          'have.attr',
          'aria-selected',
          'true'
        )

        // Check request access section
        cy.findByText('Request Access').should('exist')
        cy.findByLabelText('Enable access request').should('exist')

        // Test enabling access request
        cy.findByLabelText('Enable access request').check()

        // Info alert should appear
        cy.findByText(/Restricting limits access to published files/).should('exist')

        // Test all terms of access fields
        cy.findByLabelText('Terms of Access for Restricted Files').should('exist')
        cy.findByLabelText('Data Access Place').should('exist')
        cy.findByLabelText('Original Archive').should('exist')
        cy.findByLabelText('Availability Status').should('exist')
        cy.findByLabelText('Contact for Access').should('exist')
        cy.findByLabelText('Size of Collection').should('exist')
        cy.findByLabelText('Study Completion').should('exist')

        // Fill in some fields
        cy.findByLabelText('Terms of Access for Restricted Files').type(
          'Please contact the data owner for access to restricted files.'
        )

        cy.findByLabelText('Data Access Place').type(
          'Data can be accessed through the university data center.'
        )

        cy.findByLabelText('Contact for Access').type('dataowner@university.edu')

        cy.findByLabelText('Size of Collection').type('500 MB')

        // Test form actions
        cy.findByRole('button', { name: 'Save Changes' }).should('be.enabled')
        cy.findByRole('button', { name: 'Cancel' }).should('exist')

        // Test disabling access request (info alert should disappear)
        cy.findByLabelText('Enable access request').uncheck()
        cy.findByText(/Restricting limits access to published files/).should('not.exist')
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

        // Start with Dataset Terms tab and make a change
        cy.get('select').select('Custom Dataset Terms')
        cy.findByLabelText('Terms of Use').type('Custom terms text')

        // Switch to Restricted Files tab
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()

        // Make changes in restricted files
        cy.findByLabelText('Enable access request').check()
        cy.findByLabelText('Terms of Access for Restricted Files').type('Restricted access terms')

        // Switch back to Dataset Terms tab
        cy.findByRole('tab', { name: 'Dataset Terms' }).click()

        // Verify changes are preserved
        cy.get('select').should('have.value', 'CUSTOM')
        cy.findByDisplayValue('Custom terms text').should('exist')

        // Switch back to Restricted Files tab
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()

        // Verify changes are preserved
        cy.findByLabelText('Enable access request').should('be.checked')
        cy.findByDisplayValue('Restricted access terms').should('exist')
      })
    })
  })

  describe('Guest Book Tab', () => {
    it('can navigate to Guest Book tab', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        // Switch to Guest Book tab
        cy.findByRole('tab', { name: 'Guest Book' }).click()
        cy.findByRole('tab', { name: 'Guest Book' }).should('have.attr', 'aria-selected', 'true')

        // Guest book content should be visible
        // (This would depend on the actual Guest Book implementation)
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

        // Should start with restricted files tab active
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

        // Click on dataset title in breadcrumbs to go back
        cy.findByRole('link', { name: datasetTitle }).click()

        // Should navigate to dataset page
        cy.url().should('include', '/datasets')
        cy.findByRole('heading', { name: datasetTitle }).should('exist')
      })
    })
  })

  describe('Error handling', () => {
    it('handles non-existent dataset gracefully', () => {
      const searchParams = new URLSearchParams()
      searchParams.set(QueryParamKey.PERSISTENT_ID, 'non-existent-dataset')
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

      const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

      cy.visit(editDatasetTermsUrl)

      // Should show error or not found page
      cy.findByText('The dataset you are looking for was not found').should('exist')
    })

    it('handles unauthorized access gracefully', () => {
      // This test would need a dataset that the user doesn't have edit permissions for
      // For now, we'll skip this as it requires more complex test setup
      cy.log('Test for unauthorized access would go here')
    })
  })

  describe('Accessibility', () => {
    it('has proper keyboard navigation', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        // Test tab navigation with keyboard
        cy.findByRole('tab', { name: 'Dataset Terms' }).focus()
        cy.focused().should('have.attr', 'aria-selected', 'true')

        // Navigate to next tab with arrow keys
        cy.focused().type('{rightarrow}')
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
          'have.attr',
          'aria-selected',
          'true'
        )

        // Test form field navigation
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()
        cy.findByLabelText('Enable access request').focus()
        cy.focused().should('exist')

        // Tab through form fields using keyboard event
        cy.focused().type('{tab}')
        cy.findByLabelText('Terms of Access for Restricted Files').should('be.focused')
      })
    })

    it('has proper ARIA labels and roles', () => {
      const datasetTitle = faker.lorem.sentence()

      cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
        const searchParams = new URLSearchParams()
        searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
        searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

        const editDatasetTermsUrl = `/spa${Route.EDIT_DATASET_TERMS}?${searchParams.toString()}`

        cy.visit(editDatasetTermsUrl)

        // Check tab roles
        cy.findByRole('tab', { name: 'Dataset Terms' }).should('have.attr', 'role', 'tab')
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).should(
          'have.attr',
          'role',
          'tab'
        )

        // Check form labels
        cy.findByRole('tab', { name: 'Restricted Files + Terms of Access' }).click()
        cy.findByLabelText('Enable access request').should('exist')
        cy.findByLabelText('Terms of Access for Restricted Files').should('exist')
      })
    })
  })
})
