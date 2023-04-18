import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'

interface FormSelectProps {
  required?: boolean
  defaultValue?: string | number
  withinMultipleFieldsGroup?: boolean
}

export function FormSelect({
  required,
  defaultValue,
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormSelectProps>) {
  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Select required={required} defaultValue={defaultValue}>
        {children}
      </FormBS.Select>
    </FormElementLayout>
  )
}
