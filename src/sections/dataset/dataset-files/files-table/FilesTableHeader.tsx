import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import styles from './FilesTable.module.scss'
import { getCellStyle } from './FilesTable'
import cn from 'classnames'

interface FilesTableHeaderProps {
  headers: HeaderGroup<FilePreview>[]
  criteriaContainerHeight?: number
}

export function FilesTableHeader({ headers, criteriaContainerHeight }: FilesTableHeaderProps) {
  const isStickyHeader = criteriaContainerHeight !== undefined

  return (
    <thead
      className={cn({
        [styles['table-sticky-header']]: isStickyHeader
      })}
      style={{ top: isStickyHeader ? criteriaContainerHeight : 'unset' }}>
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
