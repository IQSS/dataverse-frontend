import { ProgressBar } from '../../../src/lib/components/progress-bar/ProgressBar'

describe('ProgressBar', () => {
  it('renders the ProgressBar', () => {
    cy.mount(<ProgressBar now={30} />)

    cy.findByRole('progressbar').should('exist')
  })
})
