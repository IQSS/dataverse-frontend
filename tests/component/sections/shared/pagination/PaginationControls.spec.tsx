import { PaginationControls } from '../../../../../src/sections/shared/pagination/PaginationControls'
import { PaginationInfo } from '../../../../../src/shared/domain/models/PaginationInfo'
import { FilePaginationInfo } from '../../../../../src/files/domain/models/FilePaginationInfo'
import { DatasetPaginationInfo } from '../../../../../src/dataset/domain/models/DatasetPaginationInfo'

let paginationInfo: PaginationInfo<FilePaginationInfo | DatasetPaginationInfo>
const page = 3
const pageSize = 10
const total = 200
describe('PaginationControls', () => {
  beforeEach(() => {
    cy.viewport(1000, 1000)
    paginationInfo = new PaginationInfo<FilePaginationInfo | DatasetPaginationInfo>(
      page,
      pageSize,
      total
    )
  })

  it('clicking on the first page button calls goToPage 1', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'First' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToPage(1))
  })

  it('clicking on the previous page button calls goToPreviousPage', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'Previous' }).click()
    cy.wrap(onPaginationInfoChange).should(
      'have.been.calledWith',
      paginationInfo.goToPreviousPage()
    )
  })

  it('clicking on a page button calls goToPage with the correct number', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: '5' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToPage(5))
  })

  it('clicking on the next page button calls goToNextPage', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'Next' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToNextPage())
  })

  it('clicking on the last page button calls setPageIndex with the last index', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByRole('button', { name: 'Last' }).click()
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.goToPage(20))
  })

  it('selecting a page size calls setPageSize with the selected value', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={onPaginationInfoChange}
      />
    )

    cy.findByLabelText('Items per page').select('50')
    cy.wrap(onPaginationInfoChange).should('have.been.calledWith', paginationInfo.withPageSize(50))

    cy.findByRole('button', { name: 'Last' }).click()
    cy.wrap(onPaginationInfoChange).should(
      'have.been.calledWith',
      paginationInfo.withPageSize(50).goToPage(4)
    )
  })

  it('does not show the page size selector if the prop is false', () => {
    const onPaginationInfoChange = cy.stub().as('onPaginationInfoChange')
    cy.customMount(
      <PaginationControls
        initialPaginationInfo={paginationInfo.withTotal(10)}
        onPaginationInfoChange={onPaginationInfoChange}
        showPageSizeSelector={false}
      />
    )

    cy.findByLabelText('Items per page').should('not.exist')
  })
})
