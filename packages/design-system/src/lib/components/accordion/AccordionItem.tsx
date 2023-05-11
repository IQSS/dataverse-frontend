import { ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'

interface AccordionItemProps {
  eventKey: string
  children: ReactNode
}

export function AccordionItem({ eventKey, children }: AccordionItemProps) {
  return <AccordionBS.Item eventKey={eventKey}>{children}</AccordionBS.Item>
}
