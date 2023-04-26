import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { RequiredInputSymbol } from '../../required-input-symbol/RequiredInputSymbol'

interface FormLabelProps {
  required?: boolean
  withinMultipleFieldsGroup?: boolean
}

export function FormLabel({
  required,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormLabelProps>) {
  const layoutProps = withinMultipleFieldsGroup ? {} : { column: true, sm: 3 }

  return (
    <FormBS.Label {...layoutProps}>
      {children}
      {required && <RequiredInputSymbol />}
    </FormBS.Label>
  )
}
