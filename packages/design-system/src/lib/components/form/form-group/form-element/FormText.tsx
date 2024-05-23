import { ReactNode } from 'react'
import { Form as FormBS } from 'react-bootstrap'

export function FormText({ children }: { children: ReactNode }) {
  return <FormBS.Text muted>{children}</FormBS.Text>
}
