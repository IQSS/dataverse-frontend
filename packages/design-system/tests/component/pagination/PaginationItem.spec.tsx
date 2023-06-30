import { Pagination } from '../../../src/lib/components/pagination/Pagination'

describe('PaginationItem component', () => {
  it('should render correctly', () => {
    cy.mount(<Pagination.Item pageNumber={10} onClick={() => {}} />)
    cy.findByRole('button', { name: '10' }).should('exist')
  })

  it('should call onClick event', () => {
    const onClick = cy.stub().resolves()
    cy.mount(<Pagination.Item pageNumber={10} onClick={onClick} />)

    cy.findByRole('button', { name: '10' }).click()

    cy.wrap(onClick).should('be.calledOnce')
  })

  it('should be disabled', () => {
    cy.mount(<Pagination.Item pageNumber={10} disabled onClick={() => {}} />)
    cy.findByRole('button', { name: '10' }).should('not.exist')
    cy.findByText('10').should('exist')
  })

  it('should be active', () => {
    cy.mount(<Pagination.Item pageNumber={10} active onClick={() => {}} />)
    const activeListItem = cy.findByText(/10/i).parent('li')
    activeListItem.should('have.class', 'active')
  })
})
