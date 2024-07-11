import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'

import * as React from 'react'

export interface FormSelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  isInvalid?: boolean
  isValid?: boolean
  disabled?: boolean
  autoFocus?: boolean
}

export const FormSelect = React.forwardRef(function FormSelect(
  {
    isInvalid,
    isValid,
    disabled,
    autoFocus,
    children,
    ...props
  }: PropsWithChildren<FormSelectProps>,
  ref
) {
  return (
    <FormBS.Select
      isInvalid={isInvalid}
      isValid={isValid}
      disabled={disabled}
      autoFocus={autoFocus}
      ref={ref as React.ForwardedRef<HTMLSelectElement>}
      {...props}>
      {children}
    </FormBS.Select>
  )
})
