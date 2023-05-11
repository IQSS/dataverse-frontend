import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

interface FormSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  withinMultipleFieldsGroup?: boolean
}

export function FormSelect({
  withinMultipleFieldsGroup,
  children,
  ...props
}: PropsWithChildren<FormSelectProps>) {
  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Select {...props}>{children}</FormBS.Select>
    </FormElementLayout>
  )
}
