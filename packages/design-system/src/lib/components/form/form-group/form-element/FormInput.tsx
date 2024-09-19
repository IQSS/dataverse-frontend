import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement

export interface FormInputProps extends React.HTMLAttributes<FormInputElement> {
  type?: 'text' | 'email' | 'password'
  readOnly?: boolean
  name?: string
  isValid?: boolean
  isInvalid?: boolean
  disabled?: boolean
  value?: string | number
  required?: boolean
  autoFocus?: boolean
  autoComplete?: string
}

export const FormInput = React.forwardRef(function FormInput(
  {
    type = 'text',
    name,
    readOnly,
    isValid,
    isInvalid,
    disabled,
    value,
    required,
    autoFocus,
    autoComplete,
    ...props
  }: FormInputProps,
  ref
) {
  return (
    <FormBS.Control
      name={name}
      type={type}
      readOnly={readOnly}
      plaintext={readOnly}
      isValid={isValid}
      isInvalid={isInvalid}
      disabled={disabled}
      value={value}
      required={required}
      autoFocus={autoFocus}
      autoComplete={autoComplete}
      ref={ref as React.ForwardedRef<HTMLInputElement>}
      {...props}
    />
  )
})
