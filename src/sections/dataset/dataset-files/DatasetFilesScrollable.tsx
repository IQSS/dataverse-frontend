import { useEffect, useMemo, useRef, useState } from 'react'
import useInfiniteScroll, { UseInfiniteScrollHookRefCallback } from 'react-infinite-scroll-hook'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useLoadFiles } from './useLoadFiles'
import { useObserveElementSize } from '../../../shared/hooks/useObserveElementSize'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FilesTable } from './files-table/FilesTable'

import styles from './DatasetFilesScrollable.module.scss'
import cn from 'classnames'

interface DatasetFilesScrollableProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
}

export type SentryRef = UseInfiniteScrollHookRefCallback

const PAGE_SIZE = 10

export function DatasetFilesScrollable({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesScrollableProps) {
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
    rootMargin: '0px 0px 150px 0px'
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

  //TODO:ME Check download only downloading 10 files. Check sticky also for this ones

  return (
    <section
      ref={rootRef}
      className={cn(styles['files-scrollable-container'], {
        [styles['files-scrollable-container--empty']]: !areFilesAvailable
      })}>
      <header ref={criteriaContainerRef} className={styles['criteria-form-container']}>
        <FileCriteriaForm
          criteria={criteria}
          onCriteriaChange={handleCriteriaChange}
          filesCountInfo={filesCountInfo}
          onInfiniteScrollMode
        />
      </header>

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
    </section>
  )
}
