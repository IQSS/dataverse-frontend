import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement

interface FormInputProps extends React.HTMLAttributes<FormInputElement> {
  type?: 'text' | 'email' | 'password'
  readOnly?: boolean
  withinMultipleFieldsGroup?: boolean
  name?: string
}

export function FormInput({
  type = 'text',
  name,
  readOnly,
  withinMultipleFieldsGroup,
  ...props
}: FormInputProps) {
  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control name={name} type={type} readOnly={readOnly} plaintext={readOnly} {...props} />
    </FormElementLayout>
  )
}
