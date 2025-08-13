import { Modal } from '../../../src/lib/components/modal/Modal'

describe('Modal', () => {
  it('renders the modal with header, body and footer', () => {
    const onHide = cy.stub()
    cy.mount(
      <Modal show onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal Body</Modal.Body>
        <Modal.Footer>
          <button>Cancel</button>
          <button>Save</button>
        </Modal.Footer>
      </Modal>
    )

    cy.findByRole('dialog').should('exist')
    cy.findByText('Modal Title').should('exist')
    cy.findByText('Modal Body').should('exist')
    cy.findByText('Cancel').should('exist')
    cy.findByText('Save').should('exist')
  })

  it('calls onHide when the close button is clicked', () => {
    const onHide = cy.stub().as('onHide')
    cy.mount(
      <Modal show onHide={onHide}>
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal Body</Modal.Body>
      </Modal>
    )

    cy.findByRole('button', { name: 'Close' }).click()
    cy.get('@onHide').should('have.been.called')
  })

  it('renders the modal with a custom size', () => {
    const onHide = cy.stub()
    cy.mount(
      <Modal show onHide={onHide} size="sm">
        <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Modal Body</Modal.Body>
      </Modal>
    )

    cy.findByRole('dialog').children().first().should('have.class', 'modal-sm')
  })
})
