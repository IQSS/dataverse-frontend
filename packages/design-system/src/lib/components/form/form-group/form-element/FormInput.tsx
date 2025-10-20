import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement

export interface FormInputProps extends Omit<React.InputHTMLAttributes<FormInputElement>, 'size'> {
  type?: 'text' | 'email' | 'password' | 'search' | 'file'
  readOnly?: boolean
  name?: string
  isValid?: boolean
  isInvalid?: boolean
  disabled?: boolean
  value?: string | number
  required?: boolean
  autoFocus?: boolean
  autoComplete?: string
  size?: 'sm' | 'lg'
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
    size,
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
      size={size}
      ref={ref as React.ForwardedRef<HTMLInputElement>}
      {...props}
    />
  )
})
