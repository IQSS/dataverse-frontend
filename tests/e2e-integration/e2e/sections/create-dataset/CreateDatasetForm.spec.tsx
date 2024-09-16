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
    cy.visit('/spa/datasets/root/create')

    cy.findByRole('heading', { name: 'Create Dataset' }).should('exist')
  })

  it('navigates to the new dataset after submitting a valid form', () => {
    cy.visit('/spa/datasets/root/create')

    cy.findByLabelText(/^Title/i).type('Test Dataset Title', { force: true })

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).type('Test description text', { force: true })
      })

    cy.findByText('Subject')
      .closest('.row')
      .within(() => {
        cy.findByLabelText('Toggle options menu').click({ force: true })

        cy.findByLabelText('Agricultural Sciences').click()
      })
    cy.findByText(/Save Dataset/i).click()

    cy.findByRole('heading', { name: 'Test Dataset Title' }).should('exist')
    cy.findByText('Success!').should('exist')
    cy.contains('This dataset has been created.').should('exist')
    cy.findByText(DatasetLabelValue.DRAFT).should('exist')
    cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
  })

  it('navigates to the home if the user cancels the form', () => {
    cy.visit('/spa/datasets/root/create')

    cy.findByText(/Cancel/i).click()

    cy.findByRole('heading', { name: 'Root' }).should('exist')
  })
})
