import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'

export function FormLabel({ children }: PropsWithChildren) {
  return <FormBS.Label>{children}</FormBS.Label>
}
