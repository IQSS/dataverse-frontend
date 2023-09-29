import { Table } from '@iqss/dataverse-design-system'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { useFilesTable } from './useFilesTable'
import { File } from '../../../../files/domain/models/File'
import { RowSelectionMessage } from './row-selection/RowSelectionMessage'
import { ZipDownloadLimitMessage } from './zip-download-limit-message/ZipDownloadLimitMessage'
import { SpinnerSymbol } from './spinner-symbol/SpinnerSymbol'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'
import { useEffect, useState } from 'react'
import { FileSelection } from './row-selection/useFileSelection'

interface FilesTableProps {
  files: File[]
  isLoading: boolean
  paginationInfo: FilePaginationInfo
  filesTotalDownloadSize: number
}

export function FilesTable({
  files,
  isLoading,
  paginationInfo,
  filesTotalDownloadSize
}: FilesTableProps) {
  const { table, fileSelection, selectAllFiles, clearFileSelection } = useFilesTable(
    files,
    paginationInfo
  )
  const [visitedPagination, setVisitedPagination] = useState<FilePaginationInfo>(paginationInfo)
  const [visitedFiles, setVisitedFiles] = useState<FileSelection>({})

  useEffect(() => {
    if (visitedPagination.page == paginationInfo.page) {
      setVisitedFiles((visitedFiles) => ({ ...visitedFiles, ...fileSelection }))
    }
    setVisitedPagination(paginationInfo)
  }, [fileSelection])

  if (isLoading) {
    return <SpinnerSymbol />
  }
  return (
    <>
      <RowSelectionMessage
        fileSelection={fileSelection}
        selectAllRows={selectAllFiles}
        totalFilesCount={paginationInfo.totalFiles}
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
