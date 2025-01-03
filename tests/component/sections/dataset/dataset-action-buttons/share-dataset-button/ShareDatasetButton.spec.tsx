import { ShareDatasetButton } from '@/sections/dataset/dataset-action-buttons/share-dataset-button/ShareDatasetButton'

describe('ShareDatasetButton', () => {
  it('opens and close the share dataset modal', () => {
    cy.viewport(1200, 800)

    cy.mountAuthenticated(<ShareDatasetButton />)
    cy.findByRole('button', { name: /Share/i }).should('exist')

    cy.findByRole('button', { name: /Share/i }).click()
    cy.findByText('Share this dataset on your favorite social media networks.').should('exist')

    cy.findAllByRole('button', { name: /Close/i }).last().click()
    cy.findByText('Share this dataset on your favorite social media networks.').should('not.exist')
  })
})
