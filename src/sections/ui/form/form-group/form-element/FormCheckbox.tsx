import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  name?: string
  id?: string
}

export function FormCheckbox({ label, name, id, ...props }: FormCheckboxProps) {
  return <FormBS.Check label={label} name={name} type="checkbox" id={id} {...props} />
}
