import { SearchInput } from '../../../../src/sections/homepage/search-input/SearchInput'

describe('SearchInput', () => {
  it('should be focused on render', () => {
    cy.customMount(<SearchInput />)
    cy.findByRole('search').should('have.focus')
  })

  it('should show the clear button when the input have value and clear the search value with it', () => {
    cy.customMount(<SearchInput />)
    cy.findByLabelText('Clear search').should('not.exist')
    cy.findByRole('search').type('test')
    cy.findByLabelText('Clear search').should('be.visible')
    cy.findByLabelText('Clear search').click()
    cy.findByRole('search').should('have.value', '')
  })
})
