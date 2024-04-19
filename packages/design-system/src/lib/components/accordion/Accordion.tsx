import { ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'
import { AccordionItem } from './AccordionItem'
import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'

interface AccordionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  defaultActiveKey?: string[] | string
  alwaysOpen?: boolean
  children: ReactNode
}

function Accordion({ defaultActiveKey, alwaysOpen = false, children, ...rest }: AccordionProps) {
  return (
    <AccordionBS defaultActiveKey={defaultActiveKey} alwaysOpen={alwaysOpen} {...rest}>
      {children}
    </AccordionBS>
  )
}

Accordion.Item = AccordionItem
Accordion.Body = AccordionBody
Accordion.Header = AccordionHeader

export { Accordion }
