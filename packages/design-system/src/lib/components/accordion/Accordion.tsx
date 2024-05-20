import { ForwardedRef, ReactNode, forwardRef } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'
import { AccordionItem } from './AccordionItem'
import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'

interface AccordionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'onSelect'> {
  defaultActiveKey?: string[] | string
  alwaysOpen?: boolean
  children: ReactNode
}

const Accordion = forwardRef(
  ({ defaultActiveKey, alwaysOpen = false, children, ...rest }: AccordionProps, ref) => {
    return (
      <AccordionBS
        defaultActiveKey={defaultActiveKey}
        alwaysOpen={alwaysOpen}
        ref={ref as ForwardedRef<HTMLDivElement>}
        {...rest}>
        {children}
      </AccordionBS>
    )
  }
)
Accordion.displayName = 'Accordion'

const AccordionNamespace = Object.assign(Accordion, {
  Item: AccordionItem,
  Body: AccordionBody,
  Header: AccordionHeader
})

export { AccordionNamespace as Accordion }
