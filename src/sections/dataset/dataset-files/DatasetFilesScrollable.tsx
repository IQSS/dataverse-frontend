import cn from 'classnames'
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useInfiniteScroll, { UseInfiniteScrollHookRefCallback } from 'react-infinite-scroll-hook'
import { Alert } from '@iqss/dataverse-design-system'
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
import { FilesContext } from '@/sections/file/FilesContext'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { FilesTree } from './files-tree/FilesTree'
import { FilesViewToggle, FilesViewMode } from './files-view-toggle/FilesViewToggle'
import { FileTreeRepository } from '@/files/domain/repositories/FileTreeRepository'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import styles from './DatasetFilesScrollable.module.scss'

interface DatasetFilesScrollableProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  datasetRepository: DatasetRepository
  canUpdateDataset?: boolean
  fileTreeRepository?: FileTreeRepository
}

const VIEW_PARAM = 'view'

export type SentryRef = UseInfiniteScrollHookRefCallback

export function DatasetFilesScrollable({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  canUpdateDataset,
  datasetRepository,
  fileTreeRepository
}: DatasetFilesScrollableProps) {
  const scrollableContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerRef = useRef<HTMLDivElement | null>(null)
  const criteriaContainerSize = useObserveElementSize(criteriaContainerRef)

  const [searchParams, setSearchParams] = useSearchParams()
  const view: FilesViewMode = searchParams.get(VIEW_PARAM) === 'tree' ? 'tree' : 'table'
  const setView = (next: FilesViewMode) => {
    const updated = new URLSearchParams(searchParams)
    if (next === 'tree') {
      updated.set(VIEW_PARAM, 'tree')
    } else {
      updated.delete(VIEW_PARAM)
    }
    setSearchParams(updated, { replace: true })
  }

  const treeRepository = useMemo<FileTreeRepository>(
    () => fileTreeRepository ?? new FileTreeJSDataverseRepository(filesRepository),
    [fileTreeRepository, filesRepository]
  )

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
    criteria,
    includeDeaccessioned: canUpdateDataset
  })

  const {
    filesTotalDownloadSize,
    isLoading: _isLoadingFilesTotalDownloadSize,
    error: errorFilesTotalDownloadSize
  } = useGetFilesTotalDownloadSize({
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria,
    includeDeaccessioned: canUpdateDataset
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
    isEmptyFiles,
    refreshFiles
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

    const totalFilesCount = await loadMore(
      paginationInfoToSend,
      criteria,
      undefined,
      canUpdateDataset
    )

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
  if (view === 'tree') {
    return (
      <section>
        <div className={styles['view-toggle-row']}>
          <FilesViewToggle view={view} onChange={setView} />
        </div>
        <FilesTree
          treeRepository={treeRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      </section>
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
          <div className={styles['view-toggle-row']}>
            <FilesViewToggle view={view} onChange={setView} />
          </div>
        </header>

        <FilesContext.Provider
          value={{ files: accumulatedFiles, isLoading, refreshFiles: refreshFiles }}>
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
            fileRepository={filesRepository}
            datasetRepository={datasetRepository}
          />
        </FilesContext.Provider>
      </div>
    </section>
  )
}
