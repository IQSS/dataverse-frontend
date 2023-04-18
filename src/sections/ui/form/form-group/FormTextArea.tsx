import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { LayoutFormGroupElement } from './LayoutFormGroupElement'

interface FormTextAreaProps {
  required?: boolean
  withinMultipleFieldsGroup?: boolean
}

export function FormTextArea({
  required,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormTextAreaProps>) {
  return (
    <LayoutFormGroupElement withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control as="textarea" rows={5} required={required}>
        {children}
      </FormBS.Control>
    </LayoutFormGroupElement>
  )
}
