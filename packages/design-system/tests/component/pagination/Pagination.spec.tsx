import { Pagination } from '../../../src/lib/components/pagination/Pagination'

describe('Pagination', () => {
  it('should render correctly', () => {
    cy.mount(<Pagination />)

    cy.findByRole('list').should('exist')
  })
})
