import { FilePaginationInfo } from '../../../../../src/files/domain/models/FilePaginationInfo'
import { DatasetPaginationInfo } from '../../../../../src/dataset/domain/models/DatasetPaginationInfo'
import { PaginationResultsInfo } from '../../../../../src/sections/shared/pagination/PaginationResultsInfo'
import { PaginationInfo } from '../../../../../src/shared/pagination/domain/models/PaginationInfo'

describe('PaginationResultsInfo', () => {
  it('shows the correct results info', () => {
    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<FilePaginationInfo | DatasetPaginationInfo>(1, 10, 11)}
      />
    )

    cy.findByText('1 to 10 of 11 Items').should('exist')
  })

  it('shows the correct results info when there is 1 item', () => {
    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<FilePaginationInfo | DatasetPaginationInfo>(1, 10, 1)}
      />
    )

    cy.findByText('1 Item').should('exist')
  })

  it('shows the correct results info for infinite scrolling mode', () => {
    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<FilePaginationInfo | DatasetPaginationInfo>(1, 10, 15)}
        forInfiniteScrolling
      />
    )
    cy.findByText('10 of 15 Datasets seen').should('exist')
  })

  // TODO:ME Add test for when there are no items
})
