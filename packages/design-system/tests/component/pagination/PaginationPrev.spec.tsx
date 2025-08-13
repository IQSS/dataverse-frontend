import { Pagination } from '../../../src/lib/components/pagination/Pagination'

describe('PaginationPrev component', () => {
  it('should render correctly', () => {
    cy.mount(<Pagination.Prev onClick={() => {}} />)
    cy.findByRole('button', { name: 'Previous' }).should('exist')
  })

  it('should call onClick event', () => {
    const onClick = cy.stub().resolves()
    cy.mount(<Pagination.Prev onClick={onClick} />)

    cy.findByRole('button', { name: 'Previous' }).click()

    cy.wrap(onClick).should('be.calledOnce')
  })

  it('should be disabled', () => {
    cy.mount(<Pagination.Prev onClick={() => {}} disabled />)
    cy.findByRole('button', { name: 'Previous' }).should('not.exist')
    cy.findByText('Previous').should('exist')
  })
})
