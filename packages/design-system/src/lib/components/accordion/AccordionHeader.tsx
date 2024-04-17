import { ElementType, ReactNode } from 'react'
import { Accordion as AccordionBS } from 'react-bootstrap'

interface AccordionHeaderProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode
  onClick?: () => void
  bsPrefix?: string
  as?: ElementType
}

export function AccordionHeader({ children, ...rest }: AccordionHeaderProps) {
  return <AccordionBS.Header {...rest}>{children}</AccordionBS.Header>
}
