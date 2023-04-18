import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { LayoutFormGroupElement } from './LayoutFormGroupElement'

interface FormSelectProps {
  required?: boolean
  withinMultipleFieldsGroup?: boolean
}

export function FormSelect({
  required,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormSelectProps>) {
  return (
    <LayoutFormGroupElement withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Select required={required}>{children}</FormBS.Select>
    </LayoutFormGroupElement>
  )
}
