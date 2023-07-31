import { Pagination } from '../../../src/lib/components/pagination/Pagination'

describe('PaginationLast component', () => {
  it('should render correctly', () => {
    cy.mount(<Pagination.Last onClick={() => {}} />)
    cy.findByRole('button', { name: 'Last' }).should('exist')
  })

  it('should call onClick event', () => {
    const onClick = cy.stub().resolves()
    cy.mount(<Pagination.Last onClick={onClick} />)

    cy.findByRole('button', { name: 'Last' }).click()

    cy.wrap(onClick).should('be.calledOnce')
  })

  it('should be disabled', () => {
    cy.mount(<Pagination.Last onClick={() => {}} disabled />)
    cy.findByRole('button', { name: 'Last' }).should('not.exist')
    cy.findByText('Last').should('exist')
  })
})
