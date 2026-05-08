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
import { useDataset } from '../DatasetContext'
import {
  Dataset,
  DatasetPublishingStatus,
  defaultLicense
} from '../../../dataset/domain/models/Dataset'
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
const PATH_PARAM = 'path'

export type SentryRef = UseInfiniteScrollHookRefCallback

/**
 * Mirror of `DatasetFiles.treeDownloadsRequireTermsGate` — kept inline
 * here so the table and tree subviews of the scrollable variant don't
 * have to share a separate util module just for this predicate.
 */
function treeDownloadsRequireTermsGate(
  dataset:
    | Pick<Dataset, 'version' | 'permissions' | 'guestbookId' | 'license' | 'termsOfUse'>
    | undefined
    | null
): boolean {
  if (!dataset) return false
  const isDraft = dataset.version.publishingStatus === DatasetPublishingStatus.DRAFT
  const canEdit = dataset.permissions.canUpdateDataset
  if (isDraft || canEdit) return false
  const hasGuestbook = dataset.guestbookId !== undefined
  const hasNonDefaultLicense =
    dataset.license !== undefined && dataset.license.name !== defaultLicense.name
  const hasCustomTerms = dataset.termsOfUse?.customTerms !== undefined
  return hasGuestbook || hasNonDefaultLicense || hasCustomTerms
}

export function DatasetFilesScrollable({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  canUpdateDataset,
  datasetRepository,
  fileTreeRepository
}: DatasetFilesScrollableProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const view: FilesViewMode = searchParams.get(VIEW_PARAM) === 'tree' ? 'tree' : 'table'
  const treePath = searchParams.get(PATH_PARAM) ?? ''
  const setView = (next: FilesViewMode) => {
    const updated = new URLSearchParams(searchParams)
    if (next === 'tree') {
      updated.set(VIEW_PARAM, 'tree')
    } else {
      updated.delete(VIEW_PARAM)
      updated.delete(PATH_PARAM)
    }
    setSearchParams(updated, { replace: true })
  }
  const setTreePath = (next: string) => {
    const updated = new URLSearchParams(searchParams)
    if (next) {
      updated.set(PATH_PARAM, next)
    } else {
      updated.delete(PATH_PARAM)
    }
    setSearchParams(updated, { replace: true })
  }

  const treeRepository = useMemo<FileTreeRepository>(
    () => fileTreeRepository ?? new FileTreeJSDataverseRepository(filesRepository),
    [fileTreeRepository, filesRepository]
  )

  // Branch on view BEFORE invoking either subview's hooks. The previous
  // single-component layout fired the table-only data hooks
  // (`useGetFilesCountInfo`, `useGetFilesTotalDownloadSize`,
  // `useGetAccumulatedFiles`) on every render — including tree mode —
  // and a transient error in any of them aborted the render with a
  // top-level <Alert>, replacing a perfectly healthy tree response with
  // an unrelated error banner.
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
      filesRepository={filesRepository}
      datasetPersistentId={datasetPersistentId}
      datasetVersion={datasetVersion}
      datasetRepository={datasetRepository}
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
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  datasetRepository: DatasetRepository
  canUpdateDataset?: boolean
  view: FilesViewMode
  onChangeView: (view: FilesViewMode) => void
}

function DatasetFilesScrollableTableView({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  canUpdateDataset,
  datasetRepository,
  view,
  onChangeView
}: DatasetFilesScrollableTableViewProps) {
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
            fileRepository={filesRepository}
            datasetRepository={datasetRepository}
          />
        </FilesContext.Provider>
      </div>
    </section>
  )
}
