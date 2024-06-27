import { PropsWithChildren, forwardRef } from 'react'
import { SelectAdvanced, SelectAdvancedProps } from '../../../select-advanced/SelectAdvanced'

export interface FormSelectAdvancedProps extends SelectAdvancedProps {
  inputButtonId: string
  isInvalid?: boolean
}

export const FormSelectAdvanced = forwardRef(
  ({ ...props }: PropsWithChildren<FormSelectAdvancedProps>, ref) => {
    return <SelectAdvanced ref={ref as React.ForwardedRef<HTMLInputElement>} {...props} />
  }
)

FormSelectAdvanced.displayName = 'FormSelectAdvanced'
