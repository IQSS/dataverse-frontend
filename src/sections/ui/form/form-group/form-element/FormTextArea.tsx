import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement
interface FormTextAreaProps extends Omit<React.HTMLAttributes<FormInputElement>, 'rows'> {
  withinMultipleFieldsGroup?: boolean
}

export function FormTextArea({ withinMultipleFieldsGroup, ...props }: FormTextAreaProps) {
  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control as="textarea" rows={5} {...props} />
    </FormElementLayout>
  )
}
