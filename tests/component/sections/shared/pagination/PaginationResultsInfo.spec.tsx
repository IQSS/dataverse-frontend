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

  it('shows the correct results when accumulated prop passed and only one result', () => {
    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<DatasetPaginationInfo>(1, 10, 1)}
        accumulated={1}
      />
    )
    cy.findByText('1 Item').should('exist')
  })

  it('shows the correct results when accumulated prop passed and results are more than one and less than page size', () => {
    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<DatasetPaginationInfo>(1, 10, 6)}
        accumulated={6}
      />
    )
    cy.findByText('6 Items').should('exist')
  })

  it('shows the correct results when accumulated prop passed and results are more than page size', () => {
    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<DatasetPaginationInfo>(1, 10, 15)}
        accumulated={10}
      />
    )
    cy.findByText('10 of 15 Items displayed').should('exist')
  })

  it('shows the correct formatted results when accumulated prop passed and results are more than page size', () => {
    const totalCount = 1500
    const expectedFormattedTotalCount = new Intl.NumberFormat().format(totalCount)

    cy.customMount(
      <PaginationResultsInfo
        paginationInfo={new PaginationInfo<DatasetPaginationInfo>(1, 100, totalCount)}
        accumulated={500}
      />
    )
    cy.findByText(`500 of ${expectedFormattedTotalCount} Items displayed`).should('exist')
  })
})
