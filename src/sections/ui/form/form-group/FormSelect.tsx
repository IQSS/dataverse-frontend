import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { LayoutFormGroupElement } from './LayoutFormGroupElement'

interface FormSelectProps {
  required?: boolean
  value?: string | number
  withinMultipleFieldsGroup?: boolean
}

export function FormSelect({
  required,
  value,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormSelectProps>) {
  return (
    <LayoutFormGroupElement withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Select required={required} value={value}>
        {children}
      </FormBS.Select>
    </LayoutFormGroupElement>
  )
}
