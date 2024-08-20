import { Table as TableBS } from 'react-bootstrap'
import styles from './Table.module.scss'

interface TableProps {
  bordered?: boolean
  children: React.ReactNode
}

export function Table({ bordered = true, children }: TableProps) {
  return (
    <TableBS striped bordered={bordered} className={styles.table}>
      {children}
    </TableBS>
  )
}
