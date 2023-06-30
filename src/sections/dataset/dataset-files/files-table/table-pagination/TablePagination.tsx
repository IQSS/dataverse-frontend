import { Pagination } from 'dataverse-design-system'
import { PageNumbersButtonsWithEllipsis } from './PageNumbersButtonsWithEllipsis'
import { PageSizeSelector } from './PageSizeSelector'
import styles from './TablePagination.module.scss'

interface TablePaginationProps {
  pageIndex: number
  pageCount: number
  pageSize: number
  setPageSize: (pageSize: number) => void
  goToPage: (pageIndex: number) => void
  goToPreviousPage: () => void
  goToNextPage: () => void
  canGoToPreviousPage: boolean
  canGoToNextPage: boolean
}

export function TablePagination({
  pageIndex,
  pageCount,
  pageSize,
  setPageSize,
  goToPage,
  goToPreviousPage,
  goToNextPage,
  canGoToPreviousPage,
  canGoToNextPage
}: TablePaginationProps) {
  return (
    <div className={styles.container}>
      <Pagination>
        <Pagination.First onClick={() => goToPage(0)} disabled={!canGoToPreviousPage} />
        <Pagination.Prev onClick={() => goToPreviousPage()} disabled={!canGoToPreviousPage} />
        <PageNumbersButtonsWithEllipsis
          selectedPageIndex={pageIndex}
          pageCount={pageCount}
          goToPage={goToPage}
        />
        <Pagination.Next onClick={() => goToNextPage()} disabled={!canGoToNextPage} />
        <Pagination.Last onClick={() => goToPage(pageCount - 1)} disabled={!canGoToNextPage} />
      </Pagination>
      <PageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
    </div>
  )
}
