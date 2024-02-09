import { Col, Pagination, Row } from '@iqss/dataverse-design-system'
import { PageNumbersButtonsWithEllipsis } from './PageNumbersButtonsWithEllipsis'
import { PageSizeSelector } from './PageSizeSelector'
import styles from './Pagination.module.scss'
import { PaginationInfo } from '../../../shared/domain/models/PaginationInfo'
import { useEffect, useState } from 'react'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'

interface PaginationProps {
  onPaginationInfoChange: (
    paginationInfo: PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>
  ) => void
  initialPaginationInfo: PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>
  showPageSizeSelector?: boolean
}
const MINIMUM_NUMBER_OF_PAGES_TO_DISPLAY_PAGINATION = 2
export function PaginationControls({
  onPaginationInfoChange,
  initialPaginationInfo,
  showPageSizeSelector = true
}: PaginationProps) {
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo | FilePaginationInfo>(
    initialPaginationInfo
  )
  const goToPage = (newPage: number) => {
    setPaginationInfo(paginationInfo.goToPage(newPage))
  }
  const goToPreviousPage = () => {
    setPaginationInfo(paginationInfo.goToPreviousPage())
  }
  const goToNextPage = () => {
    setPaginationInfo(paginationInfo.goToNextPage())
  }
  const setPageSize = (newPageSize: number) => {
    setPaginationInfo(paginationInfo.withPageSize(newPageSize))
  }

  useEffect(() => {
    onPaginationInfoChange(paginationInfo)
  }, [paginationInfo.pageSize, paginationInfo.page])

  useEffect(() => {
    setPaginationInfo(paginationInfo.withTotal(initialPaginationInfo.totalItems))
  }, [initialPaginationInfo.totalItems])

  if (paginationInfo.totalPages < MINIMUM_NUMBER_OF_PAGES_TO_DISPLAY_PAGINATION) {
    return <></>
  }
  return (
    <Row className={styles.row}>
      <Col md="auto">
        <div className={styles.container}>
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
