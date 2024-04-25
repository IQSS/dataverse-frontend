import { PropsWithChildren, forwardRef } from 'react'
import { FormElementLayout } from './FormElementLayout'
import { SelectMultiple, SelectMultipleProps } from '../../../select-multiple/SelectMultiple'

interface FormSelectMultipleProps extends SelectMultipleProps {
  withinMultipleFieldsGroup?: boolean
  ariaLabelledby: string
}

export const FormSelectMultiple = forwardRef(
  ({ withinMultipleFieldsGroup, ...props }: PropsWithChildren<FormSelectMultipleProps>, ref) => {
    return (
      <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
        <SelectMultiple ref={ref as React.ForwardedRef<HTMLSelectElement>} {...props} />
      </FormElementLayout>
    )
  }
)

FormSelectMultiple.displayName = 'FormSelectMultiple'
