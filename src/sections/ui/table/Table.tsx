import { PropsWithChildren } from 'react'
import { Table as TableBS } from 'react-bootstrap'
import styles from './Table.module.scss'

export function Table({ children }: PropsWithChildren) {
  return (
    <TableBS striped bordered className={styles.table}>
      {children}
    </TableBS>
  )
}
