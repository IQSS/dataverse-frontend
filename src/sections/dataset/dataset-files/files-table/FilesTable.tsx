import { Table } from '@iqss/dataverse-design-system'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { useFilesTable } from './useFilesTable'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { RowSelectionMessage } from './row-selection/RowSelectionMessage'
import { ZipDownloadLimitMessage } from './zip-download-limit-message/ZipDownloadLimitMessage'
import { SpinnerSymbol } from './spinner-symbol/SpinnerSymbol'
import { useEffect, useState } from 'react'
import { FileSelection } from './row-selection/useFileSelection'
import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'
import { SentryRef } from '../DatasetFilesScrollable'

type FilesTableProps =
  | {
      files: FilePreview[]
      isLoading: boolean
      paginationInfo: FilePaginationInfo
      filesTotalDownloadSize: number
      criteria: FileCriteria
      onInfiniteScrollMode?: false
      criteriaContainerHeight?: never
      sentryRef?: never
      showSentryRef?: never
      isEmptyFiles?: never
      accumulatedCount?: never
    }
  | {
      files: FilePreview[]
      isLoading: boolean
      paginationInfo: FilePaginationInfo
      filesTotalDownloadSize: number
      criteria: FileCriteria
      onInfiniteScrollMode: true
      criteriaContainerHeight: number
      sentryRef: SentryRef
      showSentryRef: boolean
      isEmptyFiles: boolean
      accumulatedCount: number
    }

export function FilesTable({
  files,
  isLoading,
  paginationInfo,
  filesTotalDownloadSize,
  criteria,
  onInfiniteScrollMode,
  criteriaContainerHeight,
  sentryRef,
  showSentryRef,
  isEmptyFiles,
  accumulatedCount
}: FilesTableProps) {
  const { table, fileSelection, selectAllFiles, clearFileSelection } = useFilesTable(
    files,
    paginationInfo,
    accumulatedCount
  )
  const [visitedPagination, setVisitedPagination] = useState<FilePaginationInfo>(paginationInfo)
  const [visitedFiles, setVisitedFiles] = useState<FileSelection>({})
  const [previousCriteria, setPreviousCriteria] = useState<FileCriteria>(criteria)

  useEffect(() => {
    if (visitedPagination.page == paginationInfo.page) {
      setVisitedFiles((visitedFiles) => ({ ...visitedFiles, ...fileSelection }))
    }
    setVisitedPagination(paginationInfo)
  }, [fileSelection, paginationInfo, visitedPagination.page])

  useEffect(() => {
    if (previousCriteria != criteria) {
      clearFileSelection()
    }
    setPreviousCriteria(criteria)
  }, [criteria, previousCriteria, clearFileSelection])

  if (!onInfiniteScrollMode && isLoading) {
    return <SpinnerSymbol />
  }

  //TODO:ME Another size observer to FilesTableHeader to sticky top RowSelectionMessage ? and ZipDownloadLimitMessage?
  return (
    <>
      <RowSelectionMessage
        fileSelection={fileSelection}
        selectAllRows={selectAllFiles}
        totalFilesCount={paginationInfo.totalItems}
        clearRowSelection={clearFileSelection}
      />
      <ZipDownloadLimitMessage
        fileSelection={fileSelection}
        visitedFiles={visitedFiles}
        filesTotalDownloadSize={filesTotalDownloadSize}
      />
      <Table>
        <FilesTableHeader
          headers={table.getHeaderGroups()}
          criteriaContainerHeight={criteriaContainerHeight}
        />
        {onInfiniteScrollMode ? (
          <FilesTableBody
            rows={table.getRowModel().rows}
            onInfiniteScrollMode={true}
            sentryRef={sentryRef}
            showSentryRef={showSentryRef}
            isEmptyFiles={isEmptyFiles}
          />
        ) : (
          <FilesTableBody rows={table.getRowModel().rows} />
        )}
      </Table>
    </>
  )
}

export function getCellStyle(cellId: string) {
  const statusCellId = 'status'
  const infoCellId = 'info'

  if (cellId == 'select') {
    return { verticalAlign: 'middle' }
  }

  if (cellId == statusCellId) {
    return { borderWidth: '0 1px 0 0' }
  }

  if (cellId == infoCellId) {
    return { borderWidth: '0 0 0 1px' }
  }

  return undefined
}
