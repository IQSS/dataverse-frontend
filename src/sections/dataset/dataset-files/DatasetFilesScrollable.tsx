import cn from 'classnames'
import { useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import useInfiniteScroll, { UseInfiniteScrollHookRefCallback } from 'react-infinite-scroll-hook'
import { Alert } from '@iqss/dataverse-design-system'
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
import { FilesTree } from './files-tree/FilesTree'
import { FilesViewToggle, FilesViewMode } from './files-view-toggle/FilesViewToggle'
import { FileTreeRepository } from '@/files/domain/repositories/FileTreeRepository'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import { useDataset } from '../DatasetContext'
import { treeDownloadsRequireTermsGate } from './treeDownloadsRequireTermsGate'
import {
  PATH_PARAM,
  VIEW_PARAM,
  nextSearchParamsForTreePath,
  nextSearchParamsForView
} from './filesViewSearchParams'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import styles from './DatasetFilesScrollable.module.scss'

interface DatasetFilesScrollableProps {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  canUpdateDataset?: boolean
  fileTreeRepository?: FileTreeRepository
}

export type SentryRef = UseInfiniteScrollHookRefCallback

export function DatasetFilesScrollable({
  datasetPersistentId,
  datasetVersion,
  canUpdateDataset,
  fileTreeRepository
}: DatasetFilesScrollableProps) {
  const { fileRepository } = useDatasetRepositories()
  const [searchParams, setSearchParams] = useSearchParams()
  const view: FilesViewMode = searchParams.get(VIEW_PARAM) === 'tree' ? 'tree' : 'table'
  const treePath = searchParams.get(PATH_PARAM) ?? ''
  const setView = (next: FilesViewMode) => {
    setSearchParams(nextSearchParamsForView(searchParams, next), { replace: true })
  }
  const setTreePath = (next: string) => {
    setSearchParams(nextSearchParamsForTreePath(searchParams, next), { replace: true })
  }

  const treeRepository = useMemo<FileTreeRepository>(
    () => fileTreeRepository ?? new FileTreeJSDataverseRepository(fileRepository),
    [fileTreeRepository, fileRepository]
  )

  return view === 'tree' ? (
    <DatasetFilesScrollableTreeView
      treeRepository={treeRepository}
      datasetPersistentId={datasetPersistentId}
      datasetVersion={datasetVersion}
      view={view}
      onChangeView={setView}
      initialPath={treePath}
      onCurrentPathChange={setTreePath}
    />
  ) : (
    <DatasetFilesScrollableTableView
      datasetPersistentId={datasetPersistentId}
      datasetVersion={datasetVersion}
      canUpdateDataset={canUpdateDataset}
      view={view}
      onChangeView={setView}
    />
  )
}

interface DatasetFilesScrollableTreeViewProps {
  treeRepository: FileTreeRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  view: FilesViewMode
  onChangeView: (view: FilesViewMode) => void
  initialPath: string
  onCurrentPathChange: (path: string) => void
}

function DatasetFilesScrollableTreeView({
  treeRepository,
  datasetPersistentId,
  datasetVersion,
  view,
  onChangeView,
  initialPath,
  onCurrentPathChange
}: DatasetFilesScrollableTreeViewProps) {
  const { dataset } = useDataset()
  const downloadsDisabled = treeDownloadsRequireTermsGate(dataset)
  return (
    <section>
      <div className={styles['view-toggle-row']}>
        <FilesViewToggle view={view} onChange={onChangeView} />
      </div>
      <FilesTree
        treeRepository={treeRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
        initialPath={initialPath}
        onCurrentPathChange={onCurrentPathChange}
        downloadsDisabled={downloadsDisabled}
      />
    </section>
  )
}

interface DatasetFilesScrollableTableViewProps {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  canUpdateDataset?: boolean
  view: FilesViewMode
  onChangeView: (view: FilesViewMode) => void
}

function DatasetFilesScrollableTableView({
  datasetPersistentId,
  datasetVersion,
  canUpdateDataset,
  view,
  onChangeView
}: DatasetFilesScrollableTableViewProps) {
  const { fileRepository } = useDatasetRepositories()
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
    filesRepository: fileRepository,
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
    filesRepository: fileRepository,
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
    filesRepository: fileRepository,
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
        <div className={styles['view-toggle-row']}>
          <FilesViewToggle view={view} onChange={onChangeView} />
        </div>
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
          <div className={styles['view-toggle-row']}>
            <FilesViewToggle view={view} onChange={onChangeView} />
          </div>
          <FileCriteriaForm
            criteria={criteria}
            onCriteriaChange={handleCriteriaChange}
            filesCountInfo={filesCountInfo}
            onInfiniteScrollMode
          />
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
          />
        </FilesContext.Provider>
      </div>
    </section>
  )
}
