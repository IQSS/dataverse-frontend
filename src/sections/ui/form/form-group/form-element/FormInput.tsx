import { Form as FormBS, InputGroup } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import { PropsWithChildren } from 'react'

interface FormInputProps {
  type: 'text' | 'email' | 'password'
  placeholder?: string
  required?: boolean
  defaultValue?: string | number
  readOnly?: boolean
  prefix?: string
  withinMultipleFieldsGroup?: boolean
}

export function FormInput({
  type,
  placeholder,
  required,
  defaultValue,
  readOnly,
  prefix,
  withinMultipleFieldsGroup
}: FormInputProps) {
  const FormInputPrefix = ({ children }: PropsWithChildren) => {
    return prefix ? (
      <InputGroup className="mb-3">
        <InputGroup.Text>{prefix}</InputGroup.Text>
        {children}
      </InputGroup>
    ) : (
      <>{children}</>
    )
  }

  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormInputPrefix>
        <FormBS.Control
          type={type}
          placeholder={placeholder}
          required={required}
          defaultValue={defaultValue}
          readOnly={readOnly}
          plaintext={readOnly}
        />
      </FormInputPrefix>
    </FormElementLayout>
  )
}
