import { Alert } from '../../../../../src/sections/layout/alert/Alert'
import { AlertVariant } from '../../../../../src/sections/layout/alert/AlertVariant'

describe('Alert component', () => {
  it('renders correctly with success variant', () => {
    cy.customMount(<Alert variant="success">This is a success message</Alert>)
    cy.findByRole('alert').should('exist')
    cy.findByLabelText('alert-icon-success').should('exist')
    cy.findByText('This is a success message', { exact: false }).should('exist')
  })

  it('renders correctly with a link', () => {
    cy.customMount(
      <Alert variant="success">
        This is a success message with <Alert.Link href="/link" link="here is a link" />
      </Alert>
    )
    cy.findByRole('button').should('exist')
  })

  it('renders correctly with danger variant', () => {
    cy.customMount(<Alert variant="danger">This is a danger message</Alert>)
    cy.findByRole('alert').should('exist')
    cy.findByLabelText('alert-icon-danger').should('exist')
    cy.findByText('This is a danger message', { exact: false }).should('exist')
  })

  it('renders correctly with warning variant', () => {
    cy.customMount(<Alert variant="warning">This is a warning message</Alert>)
    cy.findByRole('alert').should('exist')
    cy.findByLabelText('alert-icon-warning').should('exist')
    cy.findByText('This is a warning message', { exact: false }).should('exist')
  })

  it('renders correctly with info variant', () => {
    cy.customMount(<Alert variant="info">This is an info message</Alert>)
    cy.findByRole('alert').should('exist')
    cy.findByLabelText('alert-icon-info').should('exist')
    cy.findByText('This is an info message', { exact: false }).should('exist')
  })

  it('does not render when show state is false', () => {
    cy.customMount(<Alert variant="info">This is an info message.</Alert>)

    cy.findByLabelText('Close alert').click()

    cy.findByRole('alert').should('not.exist')
  })

  it('does not show a close button when the dismissible is false ', () => {
    const message = 'Test alert message'
    const variant: AlertVariant = 'warning'

    cy.customMount(
      <Alert variant={variant} dismissible={false}>
        {message}
      </Alert>
    )
    const closeButton = cy.findByRole('button')

    closeButton.should('not.exist')
  })
})
