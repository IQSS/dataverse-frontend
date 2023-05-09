import { ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'

interface AccordionHeaderProps {
  children: ReactNode
}

export function AccordionHeader({ children }: AccordionHeaderProps) {
  return <AccordionBS.Header>{children}</AccordionBS.Header>
}
