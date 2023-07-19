import { Col, Row, Table } from 'dataverse-design-system'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { TablePagination } from './table-pagination/TablePagination'
import styles from './FilesTable.module.scss'
import { useEffect } from 'react'
import { useFilesTable } from './useFilesTable'
import { RowSelectionMessage } from './row-selection/RowSelectionMessage'
import { ZipDownloadLimitMessage } from './zip-download-limit-message/ZipDownloadLimitMessage'
import { File } from '../../../../files/domain/models/File'

interface FilesTableProps {
  files: File[]
  filesCountTotal: number
}
export function FilesTable({ files, filesCountTotal }: FilesTableProps) {
  const { table, setFilesTableData, rowSelection, setRowSelection } = useFilesTable()

  useEffect(() => {
    setFilesTableData(files)
  }, [files])

  return (
    <div>
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
      <Row className={styles['pagination-container']}>
        <Col md="auto">
          <TablePagination
            pageIndex={table.getState().pagination.pageIndex}
            pageCount={table.getPageCount()}
            pageSize={table.getState().pagination.pageSize}
            setPageSize={table.setPageSize}
            goToPage={table.setPageIndex}
            goToPreviousPage={table.previousPage}
            goToNextPage={table.nextPage}
            canGoToPreviousPage={table.getCanPreviousPage()}
            canGoToNextPage={table.getCanNextPage()}
          />
        </Col>
      </Row>
    </div>
  )
}
