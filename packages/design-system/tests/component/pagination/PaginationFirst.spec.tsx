import { Pagination } from '../../../src/lib/components/pagination/Pagination'

describe('PaginationFirst component', () => {
  it('should render correctly', () => {
    cy.mount(<Pagination.First onClick={() => {}} />)
    cy.findByRole('button', { name: 'First' }).should('exist')
  })

  it('should call onClick event', () => {
    const onClick = cy.stub().resolves()
    cy.mount(<Pagination.First onClick={onClick} />)

    cy.findByRole('button', { name: 'First' }).click()

    cy.wrap(onClick).should('be.calledOnce')
  })

  it('should be disabled', () => {
    cy.mount(<Pagination.First onClick={() => {}} disabled />)

    cy.findByRole('button', { name: 'First' }).should('not.exist')
    cy.findByText('First').should('exist')
  })
})
