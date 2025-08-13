import { Col, Pagination, Row } from '@iqss/dataverse-design-system'
import { PageNumbersButtonsWithEllipsis } from './PageNumbersButtonsWithEllipsis'
import { PageSizeSelector } from './PageSizeSelector'
import styles from './Pagination.module.scss'
import { PaginationInfo } from '../../../shared/pagination/domain/models/PaginationInfo'
import { useEffect, useState } from 'react'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { useSearchParams } from 'react-router-dom'

interface PaginationProps {
  onPaginationInfoChange: (
    paginationInfo: PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>
  ) => void
  initialPaginationInfo: PaginationInfo<DatasetPaginationInfo | FilePaginationInfo>
  showPageSizeSelector?: boolean
  updateQueryParam?: boolean
}
const MINIMUM_NUMBER_OF_PAGES_TO_DISPLAY_PAGINATION = 2
export function PaginationControls({
  onPaginationInfoChange,
  initialPaginationInfo,
  showPageSizeSelector = true,
  updateQueryParam = false
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams()
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
    // TODO: Not a priority as not used for inifinite scroll is used but the eslint disable should be removed and the dependency should be added
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationInfo.pageSize])

  useEffect(() => {
    onPaginationInfoChange(paginationInfo)
    if (updateQueryParam) {
      if (searchParams.get('page') !== paginationInfo.page.toString()) {
        searchParams.set('page', paginationInfo.page.toString())
        setSearchParams(searchParams)
      }
    }
    // TODO: Not a priority as not used for inifinite scroll is used but the eslint disable should be removed and the dependency should be added
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paginationInfo.page])

  useEffect(() => {
    setPaginationInfo(paginationInfo.withTotal(initialPaginationInfo.totalItems))
    // TODO: Not a priority as not used for inifinite scroll is used but the eslint disable should be removed and the dependency should be added
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPaginationInfo.totalItems])

  useEffect(() => {
    if (updateQueryParam) {
      if (searchParams.get('page') !== paginationInfo.page.toString()) {
        const page = searchParams.get('page') ? parseInt(searchParams.get('page') as string) : 1
        searchParams.set('page', page.toString())
        setSearchParams(searchParams, { replace: true })
        goToPage(page)
      }
    }
    // TODO: Not a priority as not used for inifinite scroll is used but the eslint disable should be removed and the dependency should be added
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

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
