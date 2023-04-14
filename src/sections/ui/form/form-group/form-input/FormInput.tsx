import { Form as FormBS } from 'react-bootstrap'

interface FormInputProps {
  type: 'text' | 'email' | 'password'
  placeholder?: string
}

export function FormInput({ type, placeholder }: FormInputProps) {
  return <FormBS.Control type={type} placeholder={placeholder} />
}
