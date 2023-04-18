import { Form as FormBS } from 'react-bootstrap'
import { LayoutFormGroupElement } from './LayoutFormGroupElement'

interface FormInputProps {
  type: 'text' | 'email' | 'password'
  placeholder?: string
  required?: boolean
  withinMultipleFieldsGroup?: boolean
}

export function FormInput({
  type,
  placeholder,
  required,
  withinMultipleFieldsGroup
}: FormInputProps) {
  return (
    <LayoutFormGroupElement withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control type={type} placeholder={placeholder} required={required} />
    </LayoutFormGroupElement>
  )
}
