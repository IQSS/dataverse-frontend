import { useState } from 'react'
import { Offcanvas } from '../../../src/lib/components/offcanvas/Offcanvas'

const OffcanvasWithTrigger = ({
  placement,
  responsive,
  withCloseButton
}: {
  placement?: 'start' | 'end' | 'top' | 'bottom'
  responsive?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
  withCloseButton?: boolean
}) => {
  const [show, setShow] = useState(false)

  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)

  return (
    <div>
      <button onClick={handleShow}>Open Offcanvas</button>

      <Offcanvas show={show} onHide={handleClose} placement={placement} responsive={responsive}>
        <Offcanvas.Header closeButton={withCloseButton}>
          <Offcanvas.Title>Offcanvas Title</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body dataTestId="off-canvas-body">
          {responsive ? (
            <div>
              <p>Resize your browser to show the responsive offcanvas toggle.</p>
              <p>
                Responsive offcanvas classes hide content outside the viewport from a specified
                breakpoint and down. Above that breakpoint, the contents within will behave as
                usual.
              </p>
            </div>
          ) : (
            <p>All the content goes here</p>
          )}
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}

describe('Offcanvas', () => {
  it('opens and close correctly by a button', () => {
    cy.viewport(375, 700)

    cy.mount(<OffcanvasWithTrigger responsive="lg" placement="start" withCloseButton />)

    cy.findByTestId('off-canvas-body').should('not.be.visible')

    cy.findByRole('button', { name: /Open Offcanvas/i }).click()
    cy.findByTestId('off-canvas-body').should('be.visible')

    cy.findByLabelText(/Close/).click()
    cy.findByTestId('off-canvas-body').should('not.be.visible')
  })

  it('is shown automatically after lg screens (992px)', () => {
    cy.viewport(1200, 700)

    cy.mount(<OffcanvasWithTrigger responsive="lg" placement="start" withCloseButton />)

    cy.findByTestId('off-canvas-body').should('be.visible')
  })

  it('is not show an placement start as default props if not passed', () => {
    cy.viewport(375, 700)

    cy.mount(<OffcanvasWithTrigger responsive="lg" />)

    cy.findByTestId('off-canvas-body').should('not.be.visible')

    cy.findByRole('button', { name: /Open Offcanvas/i }).click()

    cy.findByRole('dialog').should('have.class', 'offcanvas-start')
  })
})
