import { PropsWithChildren, forwardRef } from 'react'
import { FormElementLayout } from './FormElementLayout'
import { SelectMultiple, SelectMultipleProps } from '../../../select-multiple/SelectMultiple'

export interface FormSelectMultipleProps extends SelectMultipleProps {
  withinMultipleFieldsGroup?: boolean
  inputButtonId: string
  isValid?: boolean
  isInvalid?: boolean
}

export const FormSelectMultiple = forwardRef(
  (
    {
      withinMultipleFieldsGroup,
      isInvalid,
      isValid,
      ...props
    }: PropsWithChildren<FormSelectMultipleProps>,
    ref
  ) => {
    return (
      <FormElementLayout
        withinMultipleFieldsGroup={withinMultipleFieldsGroup}
        isInvalid={isInvalid}
        isValid={isValid}>
        <SelectMultiple
          ref={ref as React.ForwardedRef<HTMLInputElement>}
          isInvalid={isInvalid}
          {...props}
        />
      </FormElementLayout>
    )
  }
)

FormSelectMultiple.displayName = 'FormSelectMultiple'
