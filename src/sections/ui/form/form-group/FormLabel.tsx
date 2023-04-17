import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { RequiredInputSymbol } from './required-input-symbol/RequiredInputSymbol'

interface FormLabelProps {
  required?: boolean
}

export function FormLabel({ required, children }: PropsWithChildren<FormLabelProps>) {
  return (
    <FormBS.Label column sm={3}>
      {children}
      {required && <RequiredInputSymbol />}
    </FormBS.Label>
  )
}
