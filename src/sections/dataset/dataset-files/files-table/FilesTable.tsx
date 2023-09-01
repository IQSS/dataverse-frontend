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
  const { table, fileSelection, selectAllFiles, clearFileSelection } = useFilesTable(
    files,
    paginationInfo
  )

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
      <ZipDownloadLimitMessage fileSelection={fileSelection} />
      <Table>
        <FilesTableHeader headers={table.getHeaderGroups()} />
        <FilesTableBody rows={table.getRowModel().rows} />
      </Table>
    </>
  )
}
