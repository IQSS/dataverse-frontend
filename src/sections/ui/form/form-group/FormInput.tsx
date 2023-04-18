import { Form as FormBS } from 'react-bootstrap'
import { LayoutFormGroupElement } from './LayoutFormGroupElement'

interface FormInputProps {
  type: 'text' | 'email' | 'password'
  placeholder?: string
  required?: boolean
  defaultValue?: string | number
  readOnly?: boolean
  withinMultipleFieldsGroup?: boolean
}

export function FormInput({
  type,
  placeholder,
  required,
  defaultValue,
  readOnly,
  withinMultipleFieldsGroup
}: FormInputProps) {
  return (
    <LayoutFormGroupElement withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control
        type={type}
        placeholder={placeholder}
        required={required}
        defaultValue={defaultValue}
        readOnly={readOnly}
        plaintext={readOnly}
      />
    </LayoutFormGroupElement>
  )
}
