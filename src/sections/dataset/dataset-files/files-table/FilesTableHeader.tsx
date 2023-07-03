import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import styles from './FilesTable.module.scss'

interface FilesTableHeaderProps {
  headers: HeaderGroup<File>[]
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
                className={header.id !== 'select' ? '' : styles['select-header']}>
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
