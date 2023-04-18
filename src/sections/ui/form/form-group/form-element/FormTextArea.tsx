import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'

interface FormTextAreaProps {
  required?: boolean
  defaultValue?: string | number
  withinMultipleFieldsGroup?: boolean
}

export function FormTextArea({
  required,
  defaultValue,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormTextAreaProps>) {
  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control as="textarea" rows={5} required={required} defaultValue={defaultValue}>
        {children}
      </FormBS.Control>
    </FormElementLayout>
  )
}
