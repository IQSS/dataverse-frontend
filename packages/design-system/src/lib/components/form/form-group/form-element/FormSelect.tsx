import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'

import * as React from 'react'

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  value?: string
  isInvalid?: boolean
  isValid?: boolean
  disabled?: boolean
}

export const FormSelect = React.forwardRef(function FormSelect(
  { value, isInvalid, isValid, disabled, children, ...props }: PropsWithChildren<FormSelectProps>,
  ref
) {
  return (
    <FormBS.Select
      value={value}
      isInvalid={isInvalid}
      isValid={isValid}
      disabled={disabled}
      ref={ref as React.ForwardedRef<HTMLSelectElement>}
      {...props}>
      {children}
    </FormBS.Select>
  )
})
