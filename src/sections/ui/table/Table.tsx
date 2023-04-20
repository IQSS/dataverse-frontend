import { PropsWithChildren } from 'react'
import { Table as TableBS } from 'react-bootstrap'

export function Table({ children }: PropsWithChildren) {
  return (
    <TableBS striped bordered>
      {children}
    </TableBS>
  )
}
