import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  label: string
  isValid?: boolean
  isInvalid?: boolean
  invalidFeedback?: string
  validFeedback?: string
}

export function FormCheckbox({
  label,
  id,
  isValid,
  isInvalid,
  validFeedback,
  invalidFeedback,
  ...props
}: FormCheckboxProps) {
  return (
    <FormBS.Check type="checkbox" id={id}>
      <FormBS.Check.Input type="checkbox" isValid={isValid} isInvalid={isInvalid} {...props} />
      <FormBS.Check.Label>{label}</FormBS.Check.Label>
      <FormBS.Control.Feedback type="invalid">{invalidFeedback}</FormBS.Control.Feedback>
      <FormBS.Control.Feedback type="valid">{validFeedback}</FormBS.Control.Feedback>
    </FormBS.Check>
  )
}
