import { PropsWithChildren, forwardRef } from 'react'
import { FormElementLayout } from './FormElementLayout'
import { SelectMultiple, SelectMultipleProps } from '../../../select-multiple/SelectMultiple'

export interface FormSelectMultipleProps extends SelectMultipleProps {
  withinMultipleFieldsGroup?: boolean
  inputButtonId: string
}

export const FormSelectMultiple = forwardRef(
  ({ withinMultipleFieldsGroup, ...props }: PropsWithChildren<FormSelectMultipleProps>, ref) => {
    return (
      <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
        <SelectMultiple ref={ref as React.ForwardedRef<HTMLInputElement>} {...props} />
      </FormElementLayout>
    )
  }
)

FormSelectMultiple.displayName = 'FormSelectMultiple'
