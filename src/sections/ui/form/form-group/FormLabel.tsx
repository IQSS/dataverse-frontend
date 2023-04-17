import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'

interface FormLabelProps {
  required?: boolean
}

export function FormLabel({ required, children }: PropsWithChildren<FormLabelProps>) {
  return (
    <FormBS.Label column sm={3}>
      {children}
      {required && <span className="text-danger"> *</span>}
    </FormBS.Label>
  )
}
