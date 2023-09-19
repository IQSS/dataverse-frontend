import { flexRender, Row } from '@tanstack/react-table'
import { File } from '../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'
import styles from './FilesTable.module.scss'
import { getCellStyle } from './FilesTable'

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
