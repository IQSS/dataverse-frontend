import { Col, Row, Table } from 'dataverse-design-system'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { TablePagination } from './table-pagination/TablePagination'
import styles from './FilesTable.module.scss'
import { useEffect } from 'react'
import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { useFiles } from '../useFiles'
import { useFilesTable } from './useFilesTable'
import { SpinnerSymbol } from './spinner-symbol/SpinnerSymbol'
import { FileRepository } from '../../../../files/domain/repositories/FileRepository'
import { RowSelectionMessage } from './row-selection/RowSelectionMessage'

interface FilesTableProps {
  filesRepository: FileRepository
  filesTotalCount: number
  datasetPersistentId: string
  datasetVersion?: string
  criteria?: FileCriteria
}
export function FilesTable({
  filesRepository,
  filesTotalCount,
  datasetPersistentId,
  datasetVersion,
  criteria
}: FilesTableProps) {
  const { files, isLoading } = useFiles(
    filesRepository,
    datasetPersistentId,
    datasetVersion,
    criteria
  )
  const { table, setFilesTableData, rowSelection } = useFilesTable()

  useEffect(() => {
    setFilesTableData(files)
  }, [files])

  if (isLoading) {
    return <SpinnerSymbol />
  }

  return (
    <div>
      <RowSelectionMessage rowSelection={rowSelection} filesTotalCount={filesTotalCount} />
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
