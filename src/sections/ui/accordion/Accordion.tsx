import { ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'
import { AccordionItem } from './AccordionItem'
import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'

interface AccordionProps {
  defaultActiveKey?: string
  alwaysOpen?: boolean
  children: ReactNode
}

function Accordion({ defaultActiveKey, children, alwaysOpen = false }: AccordionProps) {
  return (
    <AccordionBS defaultActiveKey={defaultActiveKey} alwaysOpen={alwaysOpen}>
      {children}
    </AccordionBS>
  )
}

Accordion.Item = AccordionItem
Accordion.Body = AccordionBody
Accordion.Header = AccordionHeader

export { Accordion }
