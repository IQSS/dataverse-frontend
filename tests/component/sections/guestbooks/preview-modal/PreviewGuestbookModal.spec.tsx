import { Guestbook } from '@/guestbooks/domain/models/Guestbook'
import { PreviewGuestbookModal } from '@/sections/guestbooks/preview-modal/PreviewGuestbookModal'

const guestbook: Guestbook = {
  id: 3,
  name: 'Preview Guestbook Test',
  enabled: true,
  nameRequired: true,
  emailRequired: true,
  institutionRequired: false,
  positionRequired: false,
  customQuestions: [
    {
      question: 'How will you use this data?',
      required: true,
      displayOrder: 1,
      type: 'text',
      hidden: false
    },
    {
      question: 'Do you plan to cite this dataset?',
      required: false,
      displayOrder: 2,
      type: 'text',
      hidden: false
    }
  ],
  createTime: '2026-01-01T00:00:00.000Z',
  dataverseId: 1
}

describe('PreviewGuestbookModal', () => {
  it('renders optional labels for account information and custom questions', () => {
    const handleClose = cy.stub().as('handleClose')

    cy.customMount(<PreviewGuestbookModal show handleClose={handleClose} guestbook={guestbook} />)

    cy.findByRole('dialog').should('be.visible')
    cy.findByText('Preview Guestbook Test').should('exist')
    cy.findByText('Institution (Optional)').should('exist')
    cy.findByText('Position (Optional)').should('exist')
    cy.findByText(/Do you plan to cite this dataset\?\s+\(Optional\)/).should('exist')
    cy.findByText(/How will you use this data\?\s+\(Required\)/).should('exist')

    cy.findByText('Close').click()
    cy.get('@handleClose').should('have.been.calledOnce')
  })
})
