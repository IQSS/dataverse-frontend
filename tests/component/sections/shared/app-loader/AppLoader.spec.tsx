import { AppLoader } from '@/sections/shared/layout/app-loader/AppLoader'

describe('AppLoader', () => {
  it('shows default app loader', () => {
    cy.mount(<AppLoader />)

    cy.findByTestId('app-loader').should('exist').should('be.visible')

    cy.findByTestId('app-loader').invoke('attr', 'class').should('not.contain', 'full-viewport')
  })

  it('with fullViewport prop enabled should have an extra classname', () => {
    cy.mount(<AppLoader fullViewport />)

    cy.findByTestId('app-loader').invoke('attr', 'class').should('contain', 'full-viewport')
  })
})
