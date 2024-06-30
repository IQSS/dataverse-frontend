import { useMemo, useRef, useState } from 'react'
import useInfiniteScroll, { UseInfiniteScrollHookRefCallback } from 'react-infinite-scroll-hook'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useGetAccumulatedFiles } from './useGetAccumulatedFiles'
import { useGetFilesCountInfo } from './useGetFilesCountInfo'
import { useGetFilesTotalDownloadSize } from './useGetFilesTotalDownloadSize'
import { useObserveElementSize } from '../../../shared/hooks/useObserveElementSize'
import { FilesTableScrollable } from './files-table/FilesTableScrollable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import cn from 'classnames'
import styles from './DatasetFilesScrollable.module.scss'
import { Alert } from '@iqss/dataverse-design-system'

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
    filesCountInfo,
    isLoading: _isLoadingFilesCountInfo,
    error: errorFilesCountInfo
  } = useGetFilesCountInfo({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  })

  const {
    filesTotalDownloadSize,
    isLoading: _isLoadingFilesTotalDownloadSize,
    error: errorFilesTotalDownloadSize
  } = useGetFilesTotalDownloadSize({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  })

  const {
    loadMore,
    accumulatedFiles,
    accumulatedCount,
    isLoading,
    error: errorGetAccumulatedFiles,
    areFilesAvailable,
    totalAvailable,
    hasNextPage,
    isEmptyFiles
  } = useGetAccumulatedFiles({
    filesRepository,
    datasetPersistentId,
    datasetVersion
  })

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: () => void handleOnLoadMore(paginationInfo),
    disabled: !!errorGetAccumulatedFiles,
    rootMargin: '0px 0px 150px 0px'
  })

  async function handleOnLoadMore(currentPagination: FilePaginationInfo) {
    let paginationInfoToSend = currentPagination

    if (totalAvailable !== undefined) {
      paginationInfoToSend = currentPagination.goToNextPage()
    }

    const totalFilesCount = await loadMore(paginationInfoToSend, criteria)

    if (totalFilesCount !== undefined) {
      const paginationInfoUpdated = paginationInfoToSend.withTotal(totalFilesCount)

      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const handleCriteriaChange = async (newCriteria: FileCriteria) => {
    scrollableContainerRef.current?.scrollTo({ top: 0 })

    setCriteria(newCriteria)

    const resetedPaginationInfo = new FilePaginationInfo()
    setPaginationInfo(resetedPaginationInfo)

    const totalFilesCount = await loadMore(resetedPaginationInfo, newCriteria, true)

    if (totalFilesCount !== undefined) {
      const paginationInfoUpdated = resetedPaginationInfo.withTotal(totalFilesCount)

      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const showSentryRef = useMemo(
    () => hasNextPage && !errorGetAccumulatedFiles && !isEmptyFiles,
    [hasNextPage, errorGetAccumulatedFiles, isEmptyFiles]
  )

  const errors = useMemo(
    () => [errorGetAccumulatedFiles, errorFilesCountInfo, errorFilesTotalDownloadSize],
    [errorGetAccumulatedFiles, errorFilesCountInfo, errorFilesTotalDownloadSize]
  )

  if (errors.some(Boolean)) {
    return (
      <>
        {errors.map((error, index) => {
          if (error) {
            return (
              <Alert key={index} variant="danger" dismissible={false}>
                {error}
              </Alert>
            )
          }
        })}
      </>
    )
  }

  return (
    <section ref={rootRef}>
      <div
        className={cn(styles['files-scrollable-container'], {
          [styles['files-scrollable-container--empty']]: !areFilesAvailable
        })}
        ref={scrollableContainerRef}
        data-testid="scrollable-files-container">
        <header
          ref={criteriaContainerRef}
          className={styles['criteria-form-container']}
          data-testid="criteria-form-container">
          <FileCriteriaForm
            criteria={criteria}
            onCriteriaChange={handleCriteriaChange}
            filesCountInfo={filesCountInfo}
            onInfiniteScrollMode
          />
        </header>

        <FilesTableScrollable
          files={accumulatedFiles}
          paginationInfo={paginationInfo}
          filesTotalDownloadSize={filesTotalDownloadSize}
          criteria={criteria}
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
