import { useMemo, useRef, useState } from 'react'
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

export function DatasetFilesScrollable({
  filesRepository,
  datasetPersistentId,
  datasetVersion
}: DatasetFilesScrollableProps) {
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerSize = useObserveElementSize(criteriaContainerRef)

  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(
    () => new FilePaginationInfo()
  )
  const [criteria, setCriteria] = useState<FileCriteria>(() => new FileCriteria())

  const {
    isLoading,
    accumulatedFiles,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    isEmptyFiles,
    areFilesAvailable,
    accumulatedCount,
    filesCountInfo,
    filesTotalDownloadSize
  } = useLoadFiles({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  })

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: () => void handleOnLoadMore(paginationInfo),
    disabled: !!error,
    rootMargin: '0px 0px 150px 0px'
  })

  async function handleOnLoadMore(currentPagination: FilePaginationInfo) {
    try {
      let paginationInfoToSend = currentPagination

      if (totalAvailable !== undefined) {
        paginationInfoToSend = currentPagination.goToNextPage()
      }

      const totalFilesCount = await loadMore(paginationInfoToSend, criteria)

      const paginationInfoUpdated = paginationInfoToSend.withTotal(totalFilesCount as number)

      setPaginationInfo(paginationInfoUpdated)
    } catch (error) {
      console.error(error)
    }
  }

  const handleCriteriaChange = async (newCriteria: FileCriteria) => {
    scrollableContainerRef.current?.scrollTo({ top: 0 })

    setCriteria(newCriteria)

    const resetedPaginationInfo = new FilePaginationInfo()
    setPaginationInfo(resetedPaginationInfo)

    try {
      const totalFilesCount = await loadMore(resetedPaginationInfo, newCriteria, true)

      const paginationInfoUpdated = resetedPaginationInfo.withTotal(totalFilesCount as number)

      setPaginationInfo(paginationInfoUpdated)
    } catch (error) {
      console.error(error)
    }
  }

  const showSentryRef = useMemo(
    () => hasNextPage && !error && !isEmptyFiles,
    [hasNextPage, error, isEmptyFiles]
  )

  //TODO:ME Check download only downloading 10 files. Check sticky also for this ones

  return (
    <section ref={rootRef}>
      <div
        className={cn(styles['files-scrollable-container'], {
          [styles['files-scrollable-container--empty']]: !areFilesAvailable
        })}
        ref={scrollableContainerRef}>
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
      </div>
    </section>
  )
}
