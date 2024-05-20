import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement
export interface FormTextAreaProps extends Omit<React.HTMLAttributes<FormInputElement>, 'rows'> {
  name?: string
  disabled?: boolean
  isValid?: boolean
  isInvalid?: boolean
}

export const FormTextArea = React.forwardRef(function FormTextArea(
  { name, disabled, isValid, isInvalid, ...props }: FormTextAreaProps,
  ref
) {
  return (
    <FormBS.Control
      as="textarea"
      rows={5}
      disabled={disabled}
      name={name}
      isValid={isValid}
      isInvalid={isInvalid}
      ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
      {...props}
    />
  )
})
