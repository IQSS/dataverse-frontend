import { ProgressBar } from '../../../src/lib/components/progress-bar/ProgressBar'

describe('ProgressBar', () => {
  it('renders the ProgressBar', () => {
    cy.mount(<ProgressBar now={30} />)

    cy.findByRole('progressbar').should('exist')
  })

  it('renders the ProgressBar without a now progress', () => {
    cy.mount(<ProgressBar />)

    cy.findByRole('progressbar').should('exist')
  })
})
