import { TablePagination } from '../../../../../../../src/sections/dataset/dataset-files/files-table/table-pagination/TablePagination'

let pageIndex: number
let pageCount: number
let pageSize: number
let setPageSize: (pageSize: number) => void
let goToPage: (pageIndex: number) => void
let goToPreviousPage: () => void
let goToNextPage: () => void
let canGoToPreviousPage: boolean
let canGoToNextPage: boolean

describe('TalePagination', () => {
  beforeEach(() => {
    pageIndex = 2
    pageCount = 200
    pageSize = 10
    setPageSize = cy.stub().resolves()
    goToPage = cy.stub().resolves()
    goToPreviousPage = cy.stub().resolves()
    goToNextPage = cy.stub().resolves()
    canGoToPreviousPage = true
    canGoToNextPage = true
  })

  it('clicking on the first page button calls goToPage 0', () => {
    cy.customMount(
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        goToPage={goToPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        canGoToPreviousPage={canGoToPreviousPage}
        canGoToNextPage={canGoToNextPage}
      />
    )

    cy.findByRole('button', { name: 'First' }).click()
    cy.wrap(goToPage).should('have.been.calledWith', 0)
  })

  it('clicking on the previous page button calls previousPage', () => {
    cy.customMount(
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        goToPage={goToPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        canGoToPreviousPage={canGoToPreviousPage}
        canGoToNextPage={canGoToNextPage}
      />
    )

    cy.findByRole('button', { name: 'Previous' }).click()
    cy.wrap(goToPreviousPage).should('have.been.called')
  })

  it('clicking on a page button calls setPageIndex with the correct index', () => {
    cy.customMount(
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        goToPage={goToPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        canGoToPreviousPage={canGoToPreviousPage}
        canGoToNextPage={canGoToNextPage}
      />
    )

    cy.findByRole('button', { name: '5' }).click()
    cy.wrap(goToPage).should('have.been.calledWith', 4)
  })

  it('clicking on the next page button calls nextPage', () => {
    cy.customMount(
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        goToPage={goToPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        canGoToPreviousPage={canGoToPreviousPage}
        canGoToNextPage={canGoToNextPage}
      />
    )

    cy.findByRole('button', { name: 'Next' }).click()
    cy.wrap(goToNextPage).should('have.been.called')
  })

  it('clicking on the last page button calls setPageIndex with the last index', () => {
    cy.customMount(
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        goToPage={goToPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        canGoToPreviousPage={canGoToPreviousPage}
        canGoToNextPage={canGoToNextPage}
      />
    )

    cy.findByRole('button', { name: 'Last' }).click()
    cy.wrap(goToPage).should('have.been.calledWith', 199)
  })

  it('selecting a page size calls setPageSize with the selected value', () => {
    cy.customMount(
      <TablePagination
        pageIndex={pageIndex}
        pageCount={pageCount}
        pageSize={pageSize}
        setPageSize={setPageSize}
        goToPage={goToPage}
        goToPreviousPage={goToPreviousPage}
        goToNextPage={goToNextPage}
        canGoToPreviousPage={canGoToPreviousPage}
        canGoToNextPage={canGoToNextPage}
      />
    )

    cy.findByLabelText('Files per page').select('50')
    cy.wrap(setPageSize).should('have.been.calledWith', 50)
  })
})
