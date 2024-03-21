import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement

interface FormInputProps extends React.HTMLAttributes<FormInputElement> {
  type?: 'text' | 'email' | 'password'
  readOnly?: boolean
  withinMultipleFieldsGroup?: boolean
  name?: string
  isValid?: boolean
  isInvalid?: boolean
  disabled?: boolean
  value?: string | number
}

export function FormInput({
  type = 'text',
  name,
  readOnly,
  isValid,
  isInvalid,
  disabled,
  withinMultipleFieldsGroup,
  value,
  ...props
}: FormInputProps) {
  return (
    <FormElementLayout
      withinMultipleFieldsGroup={withinMultipleFieldsGroup}
      isInvalid={isInvalid}
      isValid={isValid}>
      <FormBS.Control
        name={name}
        type={type}
        readOnly={readOnly}
        plaintext={readOnly}
        isValid={isValid}
        isInvalid={isInvalid}
        disabled={disabled}
        value={value}
        {...props}
      />
    </FormElementLayout>
  )
}
