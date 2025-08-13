import { ElementType, ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'

interface AccordionBodyProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  bsPrefix?: string
  as?: ElementType
}

export function AccordionBody({ children, ...rest }: AccordionBodyProps) {
  return <AccordionBS.Body {...rest}>{children}</AccordionBS.Body>
}
