import { Col, Pagination, Row } from '@iqss/dataverse-design-system'
import { PageNumbersButtonsWithEllipsis } from './PageNumbersButtonsWithEllipsis'
import { PageSizeSelector } from './PageSizeSelector'
import styles from './Pagination.module.scss'
import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'
import { useEffect, useState } from 'react'

interface PaginationProps<T extends PaginationInfo<T>> {
  onPaginationInfoChange: (paginationInfo: T) => void
  initialPaginationInfo: T
  showPageSizeSelector?: boolean
}
const MINIMUM_NUMBER_OF_PAGES_TO_DISPLAY_PAGINATION = 2
export function PaginationControls<T extends PaginationInfo<T>>({
  onPaginationInfoChange,
  initialPaginationInfo,
  showPageSizeSelector = true
}: PaginationProps<T>) {
  const [paginationInfo, setPaginationInfo] = useState<T>(initialPaginationInfo)
  const goToPage = (newPage: number) => {
    const updatedPaginationInfo = paginationInfo.goToPage(newPage)
    setPaginationInfo(updatedPaginationInfo)
    onPaginationInfoChange(updatedPaginationInfo)
  }
  const goToPreviousPage = () => {
    const updatedPaginationInfo = paginationInfo.goToPreviousPage()
    setPaginationInfo(updatedPaginationInfo)
    onPaginationInfoChange(updatedPaginationInfo)
  }
  const goToNextPage = () => {
    const updatedPaginationInfo = paginationInfo.goToNextPage()
    setPaginationInfo(updatedPaginationInfo)
    onPaginationInfoChange(updatedPaginationInfo)
  }
  const setPageSize = (newPageSize: number) => {
    const updatedPaginationInfo = paginationInfo.withPageSize(newPageSize)
    setPaginationInfo(updatedPaginationInfo)
    onPaginationInfoChange(updatedPaginationInfo)
  }

  useEffect(() => {
    setPaginationInfo((currentPaginationInfo) =>
      currentPaginationInfo.withTotal(initialPaginationInfo.totalItems)
    )
  }, [initialPaginationInfo.totalItems])

  if (paginationInfo.totalPages < MINIMUM_NUMBER_OF_PAGES_TO_DISPLAY_PAGINATION) {
    return <></>
  }
  return (
    <Row className={styles.row}>
      <Col md="auto">
        <div data-testid="pagination-controls" className={styles.container}>
          <Pagination>
            <Pagination.First
              onClick={() => goToPage(1)}
              disabled={!paginationInfo.hasPreviousPage}
            />
            <Pagination.Prev
              onClick={() => goToPreviousPage()}
              disabled={!paginationInfo.hasPreviousPage}
            />
            <PageNumbersButtonsWithEllipsis
              selectedPageIndex={paginationInfo.page - 1}
              pageCount={paginationInfo.totalPages}
              goToPage={goToPage}
            />
            <Pagination.Next
              onClick={() => goToNextPage()}
              disabled={!paginationInfo.hasNextPage}
            />
            <Pagination.Last
              onClick={() => goToPage(paginationInfo.totalPages)}
              disabled={!paginationInfo.hasNextPage}
            />
          </Pagination>
          {showPageSizeSelector && (
            <PageSizeSelector
              itemName={paginationInfo.itemName}
              pageSize={paginationInfo.pageSize}
              setPageSize={setPageSize}
            />
          )}
        </div>
      </Col>
    </Row>
  )
}
