import { ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'

interface AccordionBodyProps {
  children: ReactNode
}

export function AccordionBody({ children }: AccordionBodyProps) {
  return <AccordionBS.Body>{children}</AccordionBS.Body>
}
