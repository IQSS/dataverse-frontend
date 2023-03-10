import { ReactNode } from 'react'
import './row.scss'
import { Row as RowBS } from 'react-bootstrap'
import * as React from 'react'

type RowSize = number | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
interface RowProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  xs?: RowSize
  sm?: RowSize
  md?: RowSize
  lg?: RowSize
}

export function Row({ children, ...props }: RowProps) {
  return <RowBS {...props}>{children}</RowBS>
}
