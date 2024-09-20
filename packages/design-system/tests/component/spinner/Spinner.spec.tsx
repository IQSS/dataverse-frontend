import { Spinner } from '../../../src/lib/components/spinner/Spinner'

describe('Spinner', () => {
  it('renders correctly', () => {
    cy.mount(<Spinner />)

    cy.findAllByRole('status').should('exist')
  })
})
