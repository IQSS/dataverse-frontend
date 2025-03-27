import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

export interface FormCheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  label: React.ReactNode
  isValid?: boolean
  isInvalid?: boolean
  invalidFeedback?: string
  validFeedback?: string
}

export const FormCheckbox = React.forwardRef(function FormCheckbox(
  { label, id, isValid, isInvalid, ...props }: FormCheckboxProps,
  ref
) {
  return (
    <FormBS.Check type="checkbox" id={id}>
      <FormBS.Check.Input
        type="checkbox"
        isValid={isValid}
        isInvalid={isInvalid}
        ref={ref as React.ForwardedRef<HTMLInputElement>}
        {...props}
      />
      <FormBS.Check.Label>{label}</FormBS.Check.Label>
    </FormBS.Check>
  )
})
