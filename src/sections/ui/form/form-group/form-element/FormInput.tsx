import { Form as FormBS, InputGroup } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import { PropsWithChildren } from 'react'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement

interface FormInputProps extends React.HTMLAttributes<FormInputElement> {
  type: 'text' | 'email' | 'password'
  readOnly?: boolean
  prefix?: string
  withinMultipleFieldsGroup?: boolean
}

export function FormInput({
  type,
  readOnly,
  prefix,
  withinMultipleFieldsGroup,
  ...props
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
        <FormBS.Control type={type} readOnly={readOnly} plaintext={readOnly} {...props} />
      </FormInputPrefix>
    </FormElementLayout>
  )
}
