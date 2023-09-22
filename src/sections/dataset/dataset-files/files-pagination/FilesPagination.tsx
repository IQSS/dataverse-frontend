import { Col, Pagination, Row } from '@iqss/dataverse-design-system'
import { PageNumbersButtonsWithEllipsis } from './PageNumbersButtonsWithEllipsis'
import { PageSizeSelector } from './PageSizeSelector'
import styles from './FilesPagination.module.scss'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'
import { useEffect, useState } from 'react'

interface FilesPaginationProps {
  onPaginationInfoChange: (paginationInfo: FilePaginationInfo) => void
  page: number
  pageSize: number
  total: number
}
const NO_PAGES = 0
export function FilesPagination({
  onPaginationInfoChange,
  page,
  pageSize,
  total
}: FilesPaginationProps) {
  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(
    new FilePaginationInfo(page, pageSize, total)
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
  }, [paginationInfo])

  useEffect(() => {
    setPaginationInfo(paginationInfo.withTotal(total))
  }, [total])

  if (paginationInfo.totalPages === NO_PAGES) {
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
          <PageSizeSelector pageSize={paginationInfo.pageSize} setPageSize={setPageSize} />
        </div>
      </Col>
    </Row>
  )
}
