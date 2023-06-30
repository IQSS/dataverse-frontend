import { Col, Row, Table } from 'dataverse-design-system'
import { Table as TableModel } from '@tanstack/react-table'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { TablePagination } from './table-pagination/TablePagination'
import { File } from '../../../../files/domain/models/File'
import styles from './FilesTable.module.scss'

interface FilesTableProps {
  table: TableModel<File>
}
export function FilesTable({ table }: FilesTableProps) {
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
