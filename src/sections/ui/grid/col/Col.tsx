import { Col as ColBS } from 'react-bootstrap'
import { ReactNode } from 'react'
import './col.scss'
import * as React from 'react'

type ColSize = number | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'
interface ColProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  xs?: ColSize
  sm?: ColSize
  md?: ColSize
  lg?: ColSize
}

export function Col({ children, ...props }: ColProps) {
  return <ColBS {...props}>{children}</ColBS>
}
