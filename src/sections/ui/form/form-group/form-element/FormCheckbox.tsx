import { Form as FormBS } from 'react-bootstrap'
import * as React from 'react'

interface FormCheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string
  label: string
  name: string
}

export function FormCheckbox({ label, name, id, ...props }: FormCheckboxProps) {
  return <FormBS.Check label={label} name={name} type="checkbox" id={id} {...props} />
}
