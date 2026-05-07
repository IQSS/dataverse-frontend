import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FileRepository } from '../../../files/domain/repositories/FileRepository'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { useFiles } from './useFiles'
import { PaginationControls } from '../../shared/pagination/PaginationControls'
import {
  Dataset,
  DatasetPublishingStatus,
  DatasetVersion,
  defaultLicense
} from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'
import { FilesTree } from './files-tree/FilesTree'
import { FilesViewToggle, FilesViewMode } from './files-view-toggle/FilesViewToggle'
import { FileTreeRepository } from '@/files/domain/repositories/FileTreeRepository'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import { useDataset } from '../DatasetContext'
import styles from './DatasetFiles.module.scss'

/**
 * Mirrors the table-view's `shouldShowModal` decision in
 * `DownloadFilesButton.tsx`: the dataset requires the user to accept
 * a guestbook, custom terms, or non-default license before downloading,
 * UNLESS the user is on a draft or has edit permission. The tree view
 * does not yet wire the same modal flow, so the SPA host disables tree
 * download actions when the gate would apply, with the user falling
 * back to the table view to download. Tracked as a follow-up; see PR
 * description for the explicit limitation note.
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

interface DatasetFilesProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  datasetRepository: DatasetRepository
  fileTreeRepository?: FileTreeRepository
}

const VIEW_PARAM = 'view'
const PATH_PARAM = 'path'

export function DatasetFiles({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  datasetRepository,
  fileTreeRepository
}: DatasetFilesProps) {
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

  return view === 'tree' ? (
    <DatasetFilesTreeView
      treeRepository={treeRepository}
      datasetPersistentId={datasetPersistentId}
      datasetVersion={datasetVersion}
      onChangeView={setView}
      view={view}
      initialPath={treePath}
      onCurrentPathChange={setTreePath}
    />
  ) : (
    <DatasetFilesTableView
      filesRepository={filesRepository}
      datasetPersistentId={datasetPersistentId}
      datasetVersion={datasetVersion}
      datasetRepository={datasetRepository}
      onChangeView={setView}
      view={view}
    />
  )
}

interface DatasetFilesTableViewProps {
  filesRepository: FileRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  datasetRepository: DatasetRepository
  onChangeView: (view: FilesViewMode) => void
  view: FilesViewMode
}

function DatasetFilesTableView({
  filesRepository,
  datasetPersistentId,
  datasetVersion,
  datasetRepository,
  onChangeView,
  view
}: DatasetFilesTableViewProps) {
  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(new FilePaginationInfo())
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { files, isLoading, filesCountInfo, filesTotalDownloadSize } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    setPaginationInfo,
    paginationInfo,
    criteria
  )

  return (
    <>
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={setCriteria}
        filesCountInfo={filesCountInfo}
      />
      <div className={styles['view-toggle-row']}>
        <FilesViewToggle view={view} onChange={onChangeView} />
      </div>
      <FilesTable
        files={files}
        fileRepository={filesRepository}
        isLoading={isLoading}
        paginationInfo={paginationInfo}
        filesTotalDownloadSize={filesTotalDownloadSize}
        criteria={criteria}
        datasetRepository={datasetRepository}
      />
      <PaginationControls
        initialPaginationInfo={paginationInfo}
        onPaginationInfoChange={setPaginationInfo}
      />
    </>
  )
}

interface DatasetFilesTreeViewProps {
  treeRepository: FileTreeRepository
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  onChangeView: (view: FilesViewMode) => void
  view: FilesViewMode
  initialPath: string
  onCurrentPathChange: (path: string) => void
}

function DatasetFilesTreeView({
  treeRepository,
  datasetPersistentId,
  datasetVersion,
  onChangeView,
  view,
  initialPath,
  onCurrentPathChange
}: DatasetFilesTreeViewProps) {
  const { dataset } = useDataset()
  const downloadsDisabled = treeDownloadsRequireTermsGate(dataset)
  return (
    <>
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
    </>
  )
}
