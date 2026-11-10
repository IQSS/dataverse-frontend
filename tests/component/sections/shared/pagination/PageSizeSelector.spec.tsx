import { PageSizeSelector } from '@/sections/shared/pagination/PageSizeSelector'

describe('PageSizeSelector', () => {
  it('offers the default 10/25/50 options when the current page size is one of them', () => {
    const setPageSize = cy.stub().as('setPageSize')
    cy.customMount(<PageSizeSelector itemName="items" pageSize={25} setPageSize={setPageSize} />)

    cy.findByRole('combobox').as('select').should('have.value', '25')
    cy.get('@select').find('option').should('have.length', 3)
    cy.get('@select').find('option').eq(0).should('have.text', '10')
    cy.get('@select').find('option').eq(1).should('have.text', '25')
    cy.get('@select').find('option').eq(2).should('have.text', '50')
  })

  it('prepends the current size when it is not in the default set', () => {
    const setPageSize = cy.stub().as('setPageSize')
    cy.customMount(<PageSizeSelector itemName="items" pageSize={42} setPageSize={setPageSize} />)

    cy.findByRole('combobox').as('select').should('have.value', '42')
    cy.get('@select').find('option').should('have.length', 4)
    cy.get('@select').find('option').eq(0).should('have.text', '42')
    cy.get('@select').find('option').eq(1).should('have.text', '10')
    cy.get('@select').find('option').eq(2).should('have.text', '25')
    cy.get('@select').find('option').eq(3).should('have.text', '50')
  })

  it('calls setPageSize with the parsed number when the user picks a new size', () => {
    const setPageSize = cy.stub().as('setPageSize')
    cy.customMount(<PageSizeSelector itemName="items" pageSize={10} setPageSize={setPageSize} />)

    cy.findByRole('combobox').select('50')
    cy.get('@setPageSize').should('have.been.calledWith', 50)
  })
})
