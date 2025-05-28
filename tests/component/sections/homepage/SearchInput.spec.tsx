import { SearchInput } from '../../../../src/sections/homepage/search-input/SearchInput'

describe('SearchInput', () => {
  it('should be focused on render', () => {
    cy.customMount(<SearchInput searchServices={[]} />)
    cy.get('[aria-label="Search"]').should('have.focus')
  })

  it('should show the clear button when the input have value and clear the search value with it', () => {
    cy.customMount(<SearchInput searchServices={[]} />)
    cy.findByLabelText('Clear Search').should('not.exist')
    cy.get('[aria-label="Search"]').type('test')
    cy.findByLabelText('Clear Search').should('be.visible')
    cy.findByLabelText('Clear Search').click()
    cy.get('[aria-label="Search"]').should('have.value', '')
  })

  it('should be able to click the submit button when the user enters a value or not', () => {
    cy.customMount(<SearchInput searchServices={[]} />)
    cy.get('[aria-label="Search"]').type('test')
    cy.get('[aria-label="Search"]').should('have.value', 'test')
    cy.get('[aria-label="Submit Search"]').click()

    cy.get('[aria-label="Search"]').clear()
    cy.get('[aria-label="Search"]').should('have.value', '')
    cy.get('[aria-label="Submit Search"]').click()
  })
})
