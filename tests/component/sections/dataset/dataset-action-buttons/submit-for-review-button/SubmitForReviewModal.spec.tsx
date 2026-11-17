import { SubmitForReviewModal } from '@/sections/dataset/dataset-action-buttons/submit-for-review-button/SubmitForReviewModal'

const license = {
  name: 'CC0 1.0',
  uri: 'https://creativecommons.org/publicdomain/zero/1.0/',
  iconUri: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
}

const mountModal = (overrides = {}) => {
  cy.customMount(
    <SubmitForReviewModal
      show
      handleClose={cy.stub().as('close')}
      handleSubmit={cy.stub().as('submit')}
      handleCustomTermsClick={cy.stub().as('customTerms')}
      isSubmitting={false}
      errorSubmitting={null}
      license={license}
      {...overrides}
    />
  )
}

describe('SubmitForReviewModal', () => {
  it('shows the review warning and the dataset license', () => {
    mountModal()

    cy.findByRole('dialog', { name: 'Submit for Review' }).should('be.visible')
    cy.findByText(
      'You will not be able to make changes to this dataset while it is in review.'
    ).should('be.visible')
    cy.findByText('License/Data Use Agreement').should('be.visible')
    cy.findByRole('link', { name: license.name }).should('have.attr', 'href', license.uri)
    cy.findByRole('img', { name: `License image for ${license.name}` }).should(
      'have.attr',
      'src',
      license.iconUri
    )
    cy.get('@submit').should('not.have.been.called')
  })

  it('opens custom terms when the dataset has no standard license', () => {
    mountModal({ license: undefined })

    cy.findByRole('link', { name: 'Custom Dataset Terms' }).click()
    cy.get('@customTerms').should('have.been.calledOnce')
    cy.findByRole('link', { name: license.name }).should('not.exist')
  })

  it('submits only when Submit is clicked', () => {
    mountModal()

    cy.findByRole('button', { name: 'Submit', exact: true }).click()
    cy.get('@submit').should('have.been.calledOnce')
    cy.get('@close').should('not.have.been.called')
  })

  it('cancels without submitting', () => {
    mountModal()

    cy.findByRole('button', { name: 'Cancel' }).click()
    cy.get('@close').should('have.been.calledOnce')
    cy.get('@submit').should('not.have.been.called')
  })

  it('prevents duplicate submission and dismissal while submitting', () => {
    mountModal({ isSubmitting: true })

    cy.findByRole('button', { name: /^Submit/ }).should('be.disabled')
    cy.findByRole('button', { name: 'Cancel' }).should('be.disabled')
    cy.findByRole('button', { name: 'Close' }).click()
    cy.get('@close').should('not.have.been.called')
    cy.get('@submit').should('not.have.been.called')
    cy.findByRole('dialog').should('be.visible')
  })

  it('shows submission errors and allows retry', () => {
    mountModal({ errorSubmitting: 'Submission failed. Try again.' })

    cy.findByRole('alert').should('contain.text', 'Submission failed. Try again.')
    cy.findByRole('button', { name: 'Submit', exact: true }).should('be.enabled').click()
    cy.get('@submit').should('have.been.calledOnce')
  })

  it('does not render when hidden', () => {
    mountModal({ show: false })

    cy.findByRole('dialog').should('not.exist')
  })
})
