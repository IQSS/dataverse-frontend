import { flexRender, HeaderGroup } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'

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
              <th key={header.id} colSpan={header.colSpan}>
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
