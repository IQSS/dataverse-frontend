import { TestsUtils } from '../../../shared/TestsUtils'
import { faker } from '@faker-js/faker'

describe('Create Collection', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('navigates to the collection page after submitting a valid form', () => {
    cy.visit('/spa/collections/root/create')

    const collectionName = faker.lorem.words(3)

    cy.findByLabelText(/^Collection Name/i).clear({ force: true })
    cy.findByLabelText(/^Collection Name/i).type(collectionName, { force: true })

    cy.findByRole('button', { name: 'Apply suggestion' }).click({ force: true })

    cy.findByLabelText(/^Category/i).select(1, { force: true })

    cy.findByRole('button', { name: 'Create Collection' }).click({ force: true })

    cy.findByRole('heading', { name: collectionName }).should('exist')
    cy.findByText('Success!').should('exist')
  })
})
