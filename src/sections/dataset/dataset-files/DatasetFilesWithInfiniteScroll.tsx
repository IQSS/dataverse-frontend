import { useEffect, useMemo, useRef, useState } from 'react'
import useInfiniteScroll, { UseInfiniteScrollHookRefCallback } from 'react-infinite-scroll-hook'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useLoadFiles } from './useLoadFiles'
import { FilesTable } from './files-table/FilesTable'
import { useObserveElementSize } from '../../../shared/hooks/useObserveElementSize'

interface DatasetFilesWithInfiniteScrollProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

export type SentryRef = UseInfiniteScrollHookRefCallback

const PAGE_SIZE = 10

export function DatasetFilesWithInfiniteScroll({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesWithInfiniteScrollProps) {
  const criteriaContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerSize = useObserveElementSize(criteriaContainerRef)

  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(
    () => new FilePaginationInfo()
  )
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())

  const {
    isLoading,
    accumulatedFiles,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    loadFilesWithNewCriteria,
    isEmptyFiles,
    areFilesAvailable,
    accumulatedCount,
    filesCountInfo,
    filesTotalDownloadSize
  } = useLoadFiles({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    paginationInfo,
    criteria
  })

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: loadMore as VoidFunction,
    disabled: !!error,
    rootMargin: '0px 0px 250px 0px'
  })

  useEffect(() => {
    const updatePaginationTotalItems = () => {
      if (totalAvailable && totalAvailable !== paginationInfo.totalItems) {
        setPaginationInfo(paginationInfo.withTotal(totalAvailable))
      }
    }

    updatePaginationTotalItems()
  }, [totalAvailable, paginationInfo])

  useEffect(() => {
    const updatePaginationPageNumber = () => {
      setPaginationInfo((currentPagination) =>
        currentPagination.goToPage(accumulatedCount / PAGE_SIZE + 1)
      )
    }

    updatePaginationPageNumber()
  }, [accumulatedCount])

  const handleCriteriaChange = (criteria: FileCriteria) => {
    setCriteria(criteria)
    const newPaginationInfo = new FilePaginationInfo()

    void loadFilesWithNewCriteria(criteria, newPaginationInfo)
  }

  const showSentryRef = useMemo(
    () => hasNextPage && !error && !isEmptyFiles,
    [hasNextPage, error, isEmptyFiles]
  )

  // console.log(criteriaContainerSize)

  //TODO:ME Check responsiveness of elements inside FileCriteriaForm

  return (
    <section ref={rootRef} style={{ maxHeight: 600, overflow: 'auto' }}>
      <header
        ref={criteriaContainerRef}
        style={{
          position: 'sticky',
          top: 0,
          background: 'white',
          zIndex: 1000,
          paddingBlock: '1rem',
          paddingInline: '0.25rem'
        }}>
        <FileCriteriaForm
          criteria={criteria}
          onCriteriaChange={handleCriteriaChange}
          filesCountInfo={filesCountInfo}
        />
      </header>
      <div style={{ position: 'relative', zIndex: 999 }}>
        <FilesTable
          files={accumulatedFiles}
          isLoading={isLoading}
          paginationInfo={paginationInfo}
          filesTotalDownloadSize={filesTotalDownloadSize}
          criteria={criteria}
          onInfiniteScrollMode
          criteriaContainerHeight={criteriaContainerSize.height}
          sentryRef={sentryRef}
          showSentryRef={showSentryRef}
          isEmptyFiles={isEmptyFiles}
          accumulatedCount={accumulatedCount}
        />
      </div>
    </section>
  )
}
