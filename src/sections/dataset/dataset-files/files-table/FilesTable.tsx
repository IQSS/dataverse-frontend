import { Table } from 'dataverse-design-system'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { useFilesTable } from './useFilesTable'
import { RowSelectionMessage } from './row-selection/RowSelectionMessage'
import { ZipDownloadLimitMessage } from './zip-download-limit-message/ZipDownloadLimitMessage'
import { File } from '../../../../files/domain/models/File'
import { SpinnerSymbol } from './spinner-symbol/SpinnerSymbol'

interface FilesTableProps {
  files: File[]
  filesCountTotal: number
  isLoading: boolean
}
export function FilesTable({ files, filesCountTotal, isLoading }: FilesTableProps) {
  const { table, rowSelection, setRowSelection } = useFilesTable(files)

  if (isLoading) {
    return <SpinnerSymbol />
  }
  return (
    <>
      <RowSelectionMessage
        selectedFilesCount={Object.keys(rowSelection).length}
        totalFilesCount={filesCountTotal}
        setRowSelection={setRowSelection}
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
