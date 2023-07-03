import { flexRender, Row } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface FilesTableBodyProps {
  rows: Row<File>[]
}
export function FilesTableBody({ rows }: FilesTableBodyProps) {
  if (rows.length === 0) {
    return <NoFilesTableBody />
  }

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
