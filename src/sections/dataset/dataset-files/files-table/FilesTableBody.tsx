import { flexRender, Row } from '@tanstack/react-table'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { useTranslation } from 'react-i18next'
import styles from './FilesTable.module.scss'
import { getCellStyle } from './FilesTable'
import { SentryRef } from '../DatasetFilesWithInfiniteScroll'
import 'react-loading-skeleton/dist/skeleton.css'

type FilesTableBodyProps =
  | {
      rows: Row<FilePreview>[]
      onInfiniteScrollMode?: false
      showSentryRef?: never
      sentryRef?: never
      isEmptyFiles?: never
    }
  | {
      rows: Row<FilePreview>[]
      onInfiniteScrollMode: true
      showSentryRef: boolean
      sentryRef: SentryRef
      isEmptyFiles: boolean
    }

export function FilesTableBody({
  rows,
  onInfiniteScrollMode,
  showSentryRef,
  sentryRef,
  isEmptyFiles
}: FilesTableBodyProps) {
  if (!onInfiniteScrollMode && rows.length === 0) {
    return <NoFilesTableBody />
  }

  if (onInfiniteScrollMode && isEmptyFiles) {
    return <NoFilesTableBody />
  }

  return (
    <tbody>
      {rows.map((row) => {
        return (
          <tr key={row.id} className={row.getIsSelected() ? styles['selected-row'] : ''}>
            {row.getVisibleCells().map((cell) => {
              const cellIdWithoutPrefix = cell.id.split('_').slice(1).join('_')
              return (
                <td key={cell.id} style={getCellStyle(cellIdWithoutPrefix)}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              )
            })}
          </tr>
        )
      })}

      {onInfiniteScrollMode && showSentryRef && <LoadingSkeleton sentryRef={sentryRef} />}
    </tbody>
  )
}

const NoFilesTableBody = () => {
  const { t } = useTranslation('files')

  return (
    <tbody>
      <tr>
        <td colSpan={100}>{t('table.noFiles')}</td>
      </tr>
    </tbody>
  )
}

const LoadingSkeleton = ({ sentryRef }: { sentryRef: SentryRef }) => {
  return (
    <>
      <tr ref={sentryRef} data-testid="table-row-loading-skeleton">
        <SkeletonTheme>
          <td style={{ verticalAlign: 'middle' }}>
            <Skeleton height="18px" width="18px" />
          </td>
          <td colSpan={100}>
            <Skeleton height="100px" />
          </td>
        </SkeletonTheme>
      </tr>
      <tr>
        <SkeletonTheme>
          <td style={{ verticalAlign: 'middle' }}>
            <Skeleton height="18px" width="18px" />
          </td>
          <td colSpan={100}>
            <Skeleton height="100px" />
          </td>
        </SkeletonTheme>
      </tr>
      <tr>
        <SkeletonTheme>
          <td style={{ verticalAlign: 'middle' }}>
            <Skeleton height="18px" width="18px" />
          </td>
          <td colSpan={100}>
            <Skeleton height="100px" />
          </td>
        </SkeletonTheme>
      </tr>
    </>
  )
}
