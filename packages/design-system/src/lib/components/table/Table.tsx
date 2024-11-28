import { Table as TableBS } from 'react-bootstrap'
import styles from './Table.module.scss'

interface TableProps {
  striped?: boolean
  bordered?: boolean
  borderless?: boolean
  children: React.ReactNode
}

export function Table({
  striped = true,
  bordered = true,
  borderless = false,
  children
}: TableProps) {
  return (
    <TableBS striped={striped} bordered={bordered} borderless={borderless} className={styles.table}>
      {children}
    </TableBS>
  )
}
