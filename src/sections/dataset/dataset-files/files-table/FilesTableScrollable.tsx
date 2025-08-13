import { useEffect, useRef, useState } from 'react'
import { Table } from '@iqss/dataverse-design-system'
import { useFilesTableScrollable } from './useFilesTableScrollable'
import { useObserveElementSize } from '../../../../shared/hooks/useObserveElementSize'
import { FilesTableHeader } from './FilesTableHeader'
import { FilesTableBody } from './FilesTableBody'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { FileCriteria } from '../../../../files/domain/models/FileCriteria'
import { RowSelectionMessage } from './row-selection/RowSelectionMessage'
import { ZipDownloadLimitMessage } from './zip-download-limit-message/ZipDownloadLimitMessage'
import { FilePaginationInfo } from '../../../../files/domain/models/FilePaginationInfo'
import { type SentryRef } from '../DatasetFilesScrollable'
import styles from './FilesTable.module.scss'
import { FileRepository } from '@/files/domain/repositories/FileRepository'

interface FilesTableScrollableProps {
  files: FilePreview[]
  paginationInfo: FilePaginationInfo
  criteria: FileCriteria
  filesTotalDownloadSize: number
  criteriaContainerHeight: number
  sentryRef: SentryRef
  showSentryRef: boolean
  isEmptyFiles: boolean
  fileRepository: FileRepository
  accumulatedCount: number
}

export const FilesTableScrollable = ({
  files,
  paginationInfo,
  criteria,
  filesTotalDownloadSize,
  criteriaContainerHeight,
  sentryRef,
  showSentryRef,
  isEmptyFiles,
  fileRepository,
  accumulatedCount
}: FilesTableScrollableProps) => {
  const { table, fileSelection, selectAllPossibleRows, clearRowsSelection } =
    useFilesTableScrollable(files, paginationInfo, accumulatedCount, fileRepository)

  const [previousCriteria, setPreviousCriteria] = useState<FileCriteria>(criteria)

  const tableTopMessagesRef = useRef<HTMLDivElement | null>(null)
  const tableTopMessagesSize = useObserveElementSize(tableTopMessagesRef)

  const tableHeaderStickyTopValue = criteriaContainerHeight + tableTopMessagesSize.height

  useEffect(() => {
    if (previousCriteria != criteria) {
      clearRowsSelection()
    }
    setPreviousCriteria(criteria)
  }, [criteria, previousCriteria, clearRowsSelection])
  return (
    <>
      <div
        ref={tableTopMessagesRef}
        className={styles['table-top-messages']}
        style={{ top: criteriaContainerHeight }}
        data-testid="table-top-messages">
        <RowSelectionMessage
          fileSelection={fileSelection}
          selectAllRows={selectAllPossibleRows}
          totalFilesCount={paginationInfo.totalItems}
          clearRowSelection={clearRowsSelection}
        />
        <ZipDownloadLimitMessage
          fileSelection={fileSelection}
          filesTotalDownloadSize={filesTotalDownloadSize}
        />
      </div>

      <Table>
        <FilesTableHeader
          headers={table.getHeaderGroups()}
          topStickyValue={tableHeaderStickyTopValue}
        />

        <FilesTableBody
          rows={table.getRowModel().rows}
          onInfiniteScrollMode
          sentryRef={sentryRef}
          showSentryRef={showSentryRef}
          isEmptyFiles={isEmptyFiles}
        />
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
