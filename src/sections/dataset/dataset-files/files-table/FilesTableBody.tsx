import { flexRender, Row } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'

interface FilesTableBodyProps {
  rows: Row<File>[]
}
export function FilesTableBody({ rows }: FilesTableBodyProps) {
  return (
    <tbody>
      {rows.map((row) => {
        return (
          <tr key={row.id}>
            {row.getVisibleCells().map((cell) => {
              return (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              )
            })}
          </tr>
        )
      })}
    </tbody>
  )
}
