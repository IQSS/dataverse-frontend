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

  it('should show the SearchDropdown with the search services when there is more than one search service', () => {
    const searchServices = [
      { name: 'solr', displayName: 'Solr' },
      { name: 'ExternalSearch', displayName: 'External Search' }
    ]
    cy.customMount(<SearchInput searchServices={searchServices} />)
    cy.findByRole('button', { name: 'Toggle search services dropdown' })
      .should('exist')
      .as('searchDropdownToggle')

    cy.get('@searchDropdownToggle').click()

    cy.findByRole('button', { name: 'Solr' }).should('exist')
    cy.findByRole('button', { name: 'External Search' }).should('exist').click()

    // Check if the selected service is highlighted
    cy.get('@searchDropdownToggle').click()
    cy.findByRole('button', { name: 'External Search' }).should(
      'have.attr',
      'aria-selected',
      'true'
    )
    // Check if clicking on Solr unselects External Search
    cy.findByRole('button', { name: 'Solr' }).should('have.attr', 'aria-selected', 'false').click()
    cy.get('@searchDropdownToggle').click()
    cy.findByRole('button', { name: 'Solr' }).should('have.attr', 'aria-selected', 'true')
    cy.findByRole('button', { name: 'External Search' }).should(
      'have.attr',
      'aria-selected',
      'false'
    )
  })

  it('stores the selected non-Solr search service in sessionStorage on submit', () => {
    const searchServices = [
      { name: 'solr', displayName: 'Solr' },
      { name: 'ExternalSearch', displayName: 'External Search' }
    ]

    // Ensure a clean state
    cy.window().then((win) => win.sessionStorage.clear())

    cy.customMount(<SearchInput searchServices={searchServices} />)

    // Select the non-Solr search service
    cy.findByRole('button', { name: 'Toggle search services dropdown' }).click()
    cy.findByRole('button', { name: 'External Search' }).click()

    // Enter a query and submit
    cy.get('[aria-label="Search"]').type('test query')
    cy.get('[aria-label="Submit Search"]').click()

    // Assert the selected service was stored in sessionStorage
    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('search_service')).to.eq('ExternalSearch')
    })
  })

  it('sorts the search sevices to show Solr first', () => {
    const searchServices = [
      { name: 'ExternalSearch', displayName: 'External Search' },
      { name: 'solr', displayName: 'Solr' }
    ]

    cy.customMount(<SearchInput searchServices={searchServices} />)

    cy.findByRole('button', { name: 'Toggle search services dropdown' }).click()

    cy.get('[id="search-dropdown"]').within(() => {
      cy.findByText('Search Services').next().should('have.text', 'Solr')
    })
  })

  // Should not happen in practice, but we test it to ensure the order is preserved
  it('keeps the original order when there is no Solr service (covers comparator return 0)', () => {
    const searchServices = [
      { name: 'ExternalA', displayName: 'External A' },
      { name: 'ExternalB', displayName: 'External B' }
    ]

    cy.customMount(<SearchInput searchServices={searchServices} />)

    cy.findByRole('button', { name: 'Toggle search services dropdown' }).click()

    cy.get('[id="search-dropdown"]').within(() => {
      // After the header, the first two entries should be External A then External B
      cy.findByText('Search Services')
        .next()
        .should('have.text', 'External A')
        .next()
        .should('have.text', 'External B')
    })
  })
})
