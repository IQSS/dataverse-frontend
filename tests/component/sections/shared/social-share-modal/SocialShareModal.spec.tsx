import { SocialShareModal } from '@/sections/shared/social-share-modal/SocialShareModal'

describe('SocialShareModal', () => {
  it('should render the component title, help text and 3 social links', () => {
    cy.mount(
      <SocialShareModal
        show={true}
        title="The Title"
        helpText="The Help Text"
        shareUrl="shareUrl"
        handleClose={() => {}}
      />
    )

    cy.findByText('The Title').should('exist')
    cy.findByText('The Help Text').should('exist')
    cy.get('a').should('have.length', 3)
  })
})
