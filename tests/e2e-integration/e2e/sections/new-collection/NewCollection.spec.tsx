import { TestsUtils } from '../../../shared/TestsUtils'

describe('New Collection', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('navigates to the new collection page after submitting a valid form', () => {
    cy.visit('/spa/collections/new/root')

    cy.findByLabelText(/^Identifier/i).type('some-alias')

    cy.findByLabelText(/^Category/i).select(1)

    cy.findByRole('button', { name: 'Create Collection' }).click()

    cy.findByRole('heading', { name: 'Dataverse Admin Collection' }).should('exist')
    cy.findByText('Success!').should('exist')
  })
})
