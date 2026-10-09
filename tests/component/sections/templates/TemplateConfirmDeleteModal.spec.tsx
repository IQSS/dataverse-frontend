import { type ComponentProps } from 'react'
import { ConfirmDeleteTemplateModal } from '@/sections/templates/confirm-delete-template-modal/ConfirmDeleteTemplateModal'

const mountModal = (overrides?: Partial<ComponentProps<typeof ConfirmDeleteTemplateModal>>) => {
  const props: ComponentProps<typeof ConfirmDeleteTemplateModal> = {
    show: true,
    handleClose: cy.stub().as('handleClose'),
    handleDelete: cy.stub().as('handleDelete'),
    templateName: 'Template One',
    isDeleting: false,
    errorDeleting: null,
    ...overrides
  }

  return cy.customMount(<ConfirmDeleteTemplateModal {...props} />)
}

describe('ConfirmDeleteTemplateModal', () => {
  it('calls handleClose on hide when not deleting', () => {
    mountModal()

    cy.get('.modal-backdrop').click({ force: true })
    cy.get('@handleClose').should('have.been.calledOnce')
  })

  it('does not call handleClose on hide when deleting', () => {
    mountModal({ isDeleting: true })

    cy.get('.modal-backdrop').click({ force: true })
    cy.get('@handleClose').should('not.have.been.called')
  })

  it('renders error alert when errorDeleting is present', () => {
    mountModal({ errorDeleting: 'Delete failed' })

    cy.findByText(/Delete failed/i).should('exist')
  })

  it('shows spinner while deleting', () => {
    mountModal({ isDeleting: true })

    cy.get('.spinner-border').should('exist')
  })
})
