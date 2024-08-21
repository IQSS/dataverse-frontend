import { useAlertContext } from '../../../../src/sections/alerts/AlertContext'
import { AlertProvider } from '../../../../src/sections/alerts/AlertProvider'
import { AlertMessageKey } from '../../../../src/alert/domain/models/Alert'

describe('AlertProvider', () => {
  const Component = () => {
    const { alerts, addAlert, removeAlert } = useAlertContext()

    return (
      <div>
        <button
          onClick={() =>
            addAlert({ messageKey: AlertMessageKey.METADATA_UPDATED, variant: 'info' })
          }>
          Add Alert
        </button>
        <button onClick={() => removeAlert(AlertMessageKey.METADATA_UPDATED)}>Remove Alert</button>
        {alerts.map((alert, index) => (
          <div key={index}>{alert.messageKey}</div>
        ))}
      </div>
    )
  }

  it('should add an alert', () => {
    cy.mount(
      <AlertProvider>
        <Component />
      </AlertProvider>
    )

    cy.findByRole('button', { name: /Add Alert/ }).click()
    cy.findByText(AlertMessageKey.METADATA_UPDATED).should('exist')
  })

  it('should remove an alert', () => {
    cy.mount(
      <AlertProvider>
        <Component />
      </AlertProvider>
    )

    cy.findByRole('button', { name: /Add Alert/ }).click()
    cy.findByRole('button', { name: /Remove Alert/ }).click()
    cy.findByText(AlertMessageKey.METADATA_UPDATED).should('not.exist')
  })

  it('should not add the same alert twice', () => {
    cy.mount(
      <AlertProvider>
        <Component />
      </AlertProvider>
    )

    cy.findByRole('button', { name: /Add Alert/ }).click()
    cy.findByRole('button', { name: /Add Alert/ }).click()
    cy.findAllByText(AlertMessageKey.METADATA_UPDATED).should('have.length', 1)
  })
})
