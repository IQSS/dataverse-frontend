import { ReactNode } from 'react'
import './row.scss'
import { Row as RowBS } from 'react-bootstrap'
export interface RowProps {
  children: ReactNode
}

export function Row({ children }: RowProps) {
  return <RowBS>{children}</RowBS>
}
