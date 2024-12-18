import {
  FACEBOOK_SHARE_URL,
  LINKEDIN_SHARE_URL,
  SocialShareModal,
  X_SHARE_URL
} from '@/sections/shared/social-share-modal/SocialShareModal'

const urlToShare = 'some-share-url'

describe('SocialShareModal', () => {
  it('should render the component title, help text and 3 social links', () => {
    cy.mount(
      <SocialShareModal
        show={true}
        title="The Title"
        helpText="The Help Text"
        shareUrl={urlToShare}
        handleClose={() => {}}
      />
    )

    cy.findByText('The Title').should('exist')
    cy.findByText('The Help Text').should('exist')

    cy.findByLabelText('Share on LinkedIn')
      .should('exist')
      .should('have.attr', 'href', `${LINKEDIN_SHARE_URL}${urlToShare}`)

    cy.findByLabelText('Share on X, formerly Twitter')
      .should('exist')
      .should('have.attr', 'href', `${X_SHARE_URL}${urlToShare}`)

    cy.findByLabelText('Share on Facebook')
      .should('exist')
      .should('have.attr', 'href', `${FACEBOOK_SHARE_URL}${urlToShare}`)
  })
})
