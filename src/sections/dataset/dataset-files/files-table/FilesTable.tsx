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
import { FileRepository } from '@/files/domain/repositories/FileRepository'

interface FilesTableProps {
  files: FilePreview[]
  fileRepository: FileRepository
  isLoading: boolean
  paginationInfo: FilePaginationInfo
  filesTotalDownloadSize: number
  criteria: FileCriteria
}

export function FilesTable({
  files,
  isLoading,
  paginationInfo,
  filesTotalDownloadSize,
  fileRepository,
  criteria
}: FilesTableProps) {
  const { table, fileSelection, selectAllFiles, clearFileSelection } = useFilesTable(
    files,
    paginationInfo,
    fileRepository
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

  if (isLoading) {
    return <SpinnerSymbol />
  }
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
        <FilesTableHeader headers={table.getHeaderGroups()} />
        <FilesTableBody rows={table.getRowModel().rows} />
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
