import { ShareFileButton } from '@/sections/file/share-file-button/ShareFileButton'

describe('ShareFileButton', () => {
  it('opens and close the share dataset modal', () => {
    cy.viewport(1200, 800)

    cy.mountAuthenticated(<ShareFileButton />)
    cy.findByRole('button', { name: /Share/i }).should('exist')

    cy.findByRole('button', { name: /Share/i }).click()
    cy.findByText('Share this file on your favorite social media networks.').should('exist')

    cy.findAllByRole('button', { name: /Close/i }).last().click()
    cy.findByText('Share this file on your favorite social media networks.').should('not.exist')
  })
})
