import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { FilePreview } from '../../../../files/domain/models/FilePreview'
import styles from './FilesTable.module.scss'
import { getCellStyle } from './FilesTable'

interface FilesTableHeaderProps {
  headers: HeaderGroup<FilePreview>[]
}

export function FilesTableHeader({ headers }: FilesTableHeaderProps) {
  return (
    <thead>
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
