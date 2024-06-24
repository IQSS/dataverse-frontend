import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import { getCellStyle } from './FilesTable'
import cn from 'classnames'
import styles from './FilesTable.module.scss'

interface FilesTableHeaderProps {
  headers: HeaderGroup<FilePreview>[]
  topStickyValue?: number
}

export const FilesTableHeader = ({ headers, topStickyValue }: FilesTableHeaderProps) => {
  const isStickyHeader = topStickyValue !== undefined

  return (
    <thead
      className={cn({
        [styles['table-sticky-header']]: isStickyHeader
      })}
      style={{ top: isStickyHeader ? topStickyValue : 'unset' }}>
      {headers.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => {
            return (
              <th
                key={header.id}
                colSpan={header.colSpan}
                className={styles[header.id]}
                style={getCellStyle(header.id)}>
                {header.isPlaceholder ? null : (
                  <>{flexRender(header.column.columnDef.header, header.getContext())}</>
                )}
              </th>
            )
          })}
        </tr>
      ))}
    </thead>
  )
}
