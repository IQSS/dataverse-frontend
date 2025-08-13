import { Pagination } from '../../../src/lib/components/pagination/Pagination'

describe('PaginationNext component', () => {
  it('should render correctly', () => {
    cy.mount(<Pagination.Next onClick={() => {}} />)
    cy.findByRole('button', { name: 'Next' }).should('exist')
  })

  it('should call onClick event', () => {
    const onClick = cy.stub().resolves()
    cy.mount(<Pagination.Next onClick={onClick} />)

    cy.findByRole('button', { name: 'Next' }).click()

    cy.wrap(onClick).should('be.calledOnce')
  })

  it('should be disabled', () => {
    cy.mount(<Pagination.Next onClick={() => {}} disabled />)
    cy.findByRole('button', { name: 'Next' }).should('not.exist')
    cy.findByText('Next').should('exist')
  })
})
