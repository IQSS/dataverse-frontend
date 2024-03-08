import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetLabelValue } from '../../../../../src/dataset/domain/models/Dataset'

describe('Create Dataset', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('visits the Create Dataset Page as a logged in user', () => {
    cy.visit('/spa/datasets/create')

    cy.findByRole('heading', { name: 'Create Dataset' }).should('exist')
  })

  it('navigates to the new dataset after submitting a valid form', () => {
    cy.visit('/spa/datasets/create')

    cy.findByLabelText(/Title/i).type('Test Dataset Title')
    cy.findByLabelText(/Author Name/i).type('Test author name')
    cy.findByLabelText(/Point of Contact E-mail/i).type('email@test.com')
    cy.findByLabelText(/Description Text/i).type('Test description text')
    cy.findByLabelText(/Arts and Humanities/i).check()

    cy.findByText(/Save Dataset/i).click()

    cy.findByRole('heading', { name: 'Test Dataset Title' }).should('exist')
    cy.findByText(DatasetLabelValue.DRAFT).should('exist')
    cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
  })
})
