import { Pagination } from '../../../src/lib/components/pagination/Pagination'

describe('PaginationEllipsis component', () => {
  it('should render correctly', () => {
    cy.mount(<Pagination.Ellipsis />)

    cy.findByRole('button', { name: 'More' }).should('exist')
  })
})
