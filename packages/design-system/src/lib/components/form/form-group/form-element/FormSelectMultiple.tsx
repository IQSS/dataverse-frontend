import { PropsWithChildren, forwardRef } from 'react'
import { SelectMultiple, SelectMultipleProps } from '../../../select-multiple/SelectMultiple'

export interface FormSelectMultipleProps extends SelectMultipleProps {
  inputButtonId: string
  isInvalid?: boolean
}

export const FormSelectMultiple = forwardRef(
  ({ ...props }: PropsWithChildren<FormSelectMultipleProps>, ref) => {
    return <SelectMultiple ref={ref as React.ForwardedRef<HTMLInputElement>} {...props} />
  }
)

FormSelectMultiple.displayName = 'FormSelectMultiple'
