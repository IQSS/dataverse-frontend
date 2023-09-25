import { Table } from '@iqss/dataverse-design-system'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { useFilesTable } from './useFilesTable'
import { File } from '../../../../files/domain/models/File'
import { RowSelectionMessage } from './row-selection/RowSelectionMessage'
import { ZipDownloadLimitMessage } from './zip-download-limit-message/ZipDownloadLimitMessage'
import { SpinnerSymbol } from './spinner-symbol/SpinnerSymbol'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'

interface FilesTableProps {
  files: File[]
  isLoading: boolean
  paginationInfo: FilePaginationInfo
}

export function FilesTable({ files, isLoading, paginationInfo }: FilesTableProps) {
  const { table, rowSelection, selectAllRows, clearRowSelection } = useFilesTable(
    files,
    paginationInfo
  )

  if (isLoading) {
    return <SpinnerSymbol />
  }
  return (
    <>
      <RowSelectionMessage
        rowSelection={rowSelection}
        selectAllRows={selectAllRows}
        totalFilesCount={paginationInfo.total}
        clearRowSelection={clearRowSelection}
      />
      <ZipDownloadLimitMessage
        selectedFiles={table.getSelectedRowModel().flatRows.map((row) => row.original)}
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
