import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { LayoutFormGroupElement } from './LayoutFormGroupElement'

interface FormTextAreaProps {
  required?: boolean
  value?: string | number
  withinMultipleFieldsGroup?: boolean
}

export function FormTextArea({
  required,
  value,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormTextAreaProps>) {
  return (
    <LayoutFormGroupElement withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control as="textarea" rows={5} required={required} value={value}>
        {children}
      </FormBS.Control>
    </LayoutFormGroupElement>
  )
}
