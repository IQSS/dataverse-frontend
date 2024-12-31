import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement
export interface FormTextAreaProps extends Omit<React.HTMLAttributes<FormInputElement>, 'rows'> {
  name?: string
  disabled?: boolean
  isValid?: boolean
  isInvalid?: boolean
  value?: string
  autoFocus?: boolean
}

export const FormTextArea = React.forwardRef(function FormTextArea(
  { name, disabled, isValid, isInvalid, value, autoFocus, ...props }: FormTextAreaProps,
  ref
) {
  return (
    <FormBS.Control
      as="textarea"
      disabled={disabled}
      name={name}
      isValid={isValid}
      isInvalid={isInvalid}
      value={value}
      autoFocus={autoFocus}
      ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
      {...props}
    />
  )
})
