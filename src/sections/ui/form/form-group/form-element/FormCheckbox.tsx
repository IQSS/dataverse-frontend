import { Form as FormBS } from 'react-bootstrap'

interface FormCheckboxProps {
  defaultChecked?: boolean
  label?: string
  name?: string
  id?: string
  required?: boolean
  value?: string | number
}

export function FormCheckbox({
  defaultChecked,
  label,
  name,
  id,
  required,
  value
}: FormCheckboxProps) {
  return (
    <FormBS.Check
      defaultChecked={defaultChecked}
      label={label}
      name={name}
      type="checkbox"
      id={id}
      required={required}
      value={value}
    />
  )
}
