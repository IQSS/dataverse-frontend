import { ElementType, ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'

export interface AccordionItemProps extends React.HTMLAttributes<HTMLElement> {
  eventKey: string
  children: ReactNode
  bsPrefix?: string
  as?: ElementType
}

export function AccordionItem({ children, ...rest }: AccordionItemProps) {
  return <AccordionBS.Item {...rest}>{children}</AccordionBS.Item>
}
