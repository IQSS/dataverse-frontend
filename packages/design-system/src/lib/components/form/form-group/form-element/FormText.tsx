import { ReactNode } from 'react'
import { Form as FormBS } from 'react-bootstrap'

export function FormText({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <FormBS.Text muted className={className}>
      {children}
    </FormBS.Text>
  )
}
