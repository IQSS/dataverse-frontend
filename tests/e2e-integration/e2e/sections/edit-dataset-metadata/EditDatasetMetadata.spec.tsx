import { faker } from '@faker-js/faker'
import { TestsUtils } from '../../../shared/TestsUtils'
import {
  DatasetLabelValue,
  DatasetNonNumericVersionSearchParam
} from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetHelper } from '../../../shared/datasets/DatasetHelper'
import { QueryParamKey, Route } from '../../../../../src/sections/Route.enum'

describe('Edit Dataset metadata', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('visits the Edit Dataset Metadata Page as a logged in user', () => {
    const datasetTitle = faker.lorem.sentence()

    cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
      const searchParams = new URLSearchParams()
      searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

      const editDatasetMetadataUrl = `/spa${Route.EDIT_DATASET_METADATA}?${searchParams.toString()}`

      cy.visit(editDatasetMetadataUrl)

      cy.findByRole('link', { name: 'Root' })
        .closest('.breadcrumb')
        .within(() => {
          cy.findByRole('link', { name: datasetTitle }).should('exist')
          cy.findByText('Edit Dataset Metadata').should('exist')
        })
    })
  })

  it('navigates to the edited dataset after submitting a valid form', () => {
    const datasetTitle = faker.lorem.sentence()

    cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
      const searchParams = new URLSearchParams()
      searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

      const editDatasetMetadataUrl = `/spa${Route.EDIT_DATASET_METADATA}?${searchParams.toString()}`

      cy.visit(editDatasetMetadataUrl)

      cy.findByLabelText(/^Title/i)
        .clear({ force: true })
        .type('Edited title', { force: true })

      cy.findAllByText(/Save Changes/i)
        .first()
        .click({ force: true })

      cy.findByRole('heading', { name: 'Edited title' }).should('exist')
      cy.findByText('Success!').should('exist')
      cy.contains('The metadata for this dataset has been updated.').should('exist')
      cy.findByText(DatasetLabelValue.DRAFT).should('exist')
      cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
    })
  })

  it('redirects to the Log In page when the user is not authenticated', () => {
    cy.wrap(TestsUtils.logout())

    const datasetTitle = faker.lorem.sentence()

    cy.wrap(DatasetHelper.createWithTitle(datasetTitle), { timeout: 10000 }).then((dataset) => {
      const searchParams = new URLSearchParams()
      searchParams.set(QueryParamKey.PERSISTENT_ID, dataset.persistentId)
      searchParams.set(QueryParamKey.VERSION, DatasetNonNumericVersionSearchParam.DRAFT)

      const editDatasetMetadataUrl = `/spa${Route.EDIT_DATASET_METADATA}?${searchParams.toString()}`

      cy.visit(editDatasetMetadataUrl)

      cy.get('#login-container').should('exist')
      cy.url().should('include', '/loginpage.xhtml')
    })
  })
})
