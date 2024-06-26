import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

export interface FormRadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  label: string
  isValid?: boolean
  isInvalid?: boolean
  invalidFeedback?: string
  validFeedback?: string
}

export const FormRadio = React.forwardRef(function FormRadio(
  { label, id, isValid, isInvalid, validFeedback, invalidFeedback, ...props }: FormRadioProps,
  ref
) {
  return (
    <FormBS.Check type="radio" id={id}>
      <FormBS.Check.Input
        type="radio"
        isValid={isValid}
        isInvalid={isInvalid}
        ref={ref as React.ForwardedRef<HTMLInputElement>}
        {...props}
      />
      <FormBS.Check.Label>{label}</FormBS.Check.Label>
      <FormBS.Control.Feedback type="invalid">{invalidFeedback}</FormBS.Control.Feedback>
      <FormBS.Control.Feedback type="valid">{validFeedback}</FormBS.Control.Feedback>
    </FormBS.Check>
  )
})
