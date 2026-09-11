import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FilesTable } from './files-table/FilesTable'
import { FileCriteriaForm } from './file-criteria-form/FileCriteriaForm'
import { FileCriteria } from '../../../files/domain/models/FileCriteria'
import { useFiles } from './useFiles'
import { PaginationControls } from '../../shared/pagination/PaginationControls'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../../../files/domain/models/FilePaginationInfo'
import { useDatasetRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { FilesTree } from './files-tree/FilesTree'
import { bearerDownloadFetchInit } from './bearerDownloadFetchInit'
import { FilesViewToggle, FilesViewMode } from './files-view-toggle/FilesViewToggle'
import { FileTreeRepository } from '@/files/domain/repositories/FileTreeRepository'
import { SdkFilePreviewSource } from '@/files/infrastructure/repositories/SdkFilePreviewSource'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import { useDataset } from '../DatasetContext'
import { treeDownloadsRequireTermsGate } from './treeDownloadsRequireTermsGate'
import {
  PATH_PARAM,
  VIEW_PARAM,
  nextSearchParamsForTreePath,
  nextSearchParamsForView
} from './filesViewSearchParams'
import styles from './DatasetFiles.module.scss'

interface DatasetFilesProps {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  fileTreeRepository?: FileTreeRepository
}

export function DatasetFiles({
  datasetPersistentId,
  datasetVersion,
  fileTreeRepository
}: DatasetFilesProps) {
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
    () => fileTreeRepository ?? new FileTreeJSDataverseRepository(new SdkFilePreviewSource()),
    [fileTreeRepository]
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
      datasetPersistentId={datasetPersistentId}
      datasetVersion={datasetVersion}
      onChangeView={setView}
      view={view}
    />
  )
}

interface DatasetFilesTableViewProps {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  onChangeView: (view: FilesViewMode) => void
  view: FilesViewMode
}

function DatasetFilesTableView({
  datasetPersistentId,
  datasetVersion,
  onChangeView,
  view
}: DatasetFilesTableViewProps) {
  const { fileRepository } = useDatasetRepositories()
  const [paginationInfo, setPaginationInfo] = useState<FilePaginationInfo>(new FilePaginationInfo())
  const [criteria, setCriteria] = useState<FileCriteria>(new FileCriteria())
  const { files, isLoading, filesCountInfo, filesTotalDownloadSize } = useFiles(
    fileRepository,
    datasetPersistentId,
    datasetVersion,
    setPaginationInfo,
    paginationInfo,
    criteria
  )

  return (
    <>
      <div className={styles['view-toggle-row']}>
        <FilesViewToggle view={view} onChange={onChangeView} />
      </div>
      <FileCriteriaForm
        criteria={criteria}
        onCriteriaChange={setCriteria}
        filesCountInfo={filesCountInfo}
      />
      <FilesTable
        files={files}
        isLoading={isLoading}
        paginationInfo={paginationInfo}
        filesTotalDownloadSize={filesTotalDownloadSize}
        criteria={criteria}
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
        downloadFetchInit={bearerDownloadFetchInit}
      />
    </>
  )
}
