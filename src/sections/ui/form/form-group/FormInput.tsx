import { Form as FormBS } from 'react-bootstrap'
import { LayoutFormGroupElement } from './LayoutFormGroupElement'

interface FormInputProps {
  type: 'text' | 'email' | 'password'
  placeholder?: string
  required?: boolean
  value?: string | number
  readOnly?: boolean
  withinMultipleFieldsGroup?: boolean
}

export function FormInput({
  type,
  placeholder,
  required,
  value,
  readOnly,
  withinMultipleFieldsGroup
}: FormInputProps) {
  return (
    <LayoutFormGroupElement withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        readOnly={readOnly}
        plaintext={readOnly}
      />
    </LayoutFormGroupElement>
  )
}
