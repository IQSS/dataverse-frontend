import { Accordion as AccordionBS, AccordionProps as AccordionPropsBS } from 'react-bootstrap'
import { AccordionItem } from './AccordionItem'
import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'
function Accordion({ alwaysOpen = false, children, ...rest }: AccordionPropsBS) {
  return (
    <AccordionBS alwaysOpen={alwaysOpen} {...rest}>
      {children}
    </AccordionBS>
  )
}

Accordion.Item = AccordionItem
Accordion.Body = AccordionBody
Accordion.Header = AccordionHeader

export { Accordion }
