import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  withinMultipleFieldsGroup?: boolean
}

export const FormSelect = React.forwardRef(function FormSelect(
  { withinMultipleFieldsGroup, children, ...props }: PropsWithChildren<FormSelectProps>,
  ref
) {
  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Select ref={ref as React.ForwardedRef<HTMLSelectElement>} {...props}>
        {children}
      </FormBS.Select>
    </FormElementLayout>
  )
})
