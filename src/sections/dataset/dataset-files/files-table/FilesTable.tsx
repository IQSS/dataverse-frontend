import { Col, Row, Table } from '@iqss/dataverse-design-system'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { TablePagination } from './table-pagination/TablePagination'
import styles from './FilesTable.module.scss'
import { useFilesTable } from './useFilesTable'
import { SpinnerSymbol } from './spinner-symbol/SpinnerSymbol'
import { File } from '../../../../files/domain/models/File'

interface FilesTableProps {
  files: File[]
  isLoading: boolean
}

export function FilesTable({ files, isLoading }: FilesTableProps) {
  const { table } = useFilesTable(files)

  if (isLoading) {
    return <SpinnerSymbol />
  }

  return (
    <div>
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
