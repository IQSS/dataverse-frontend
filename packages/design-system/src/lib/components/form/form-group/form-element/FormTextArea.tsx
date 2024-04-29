import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement
export interface FormTextAreaProps extends Omit<React.HTMLAttributes<FormInputElement>, 'rows'> {
  withinMultipleFieldsGroup?: boolean
  name?: string
  disabled?: boolean
  isValid?: boolean
  isInvalid?: boolean
}

export const FormTextArea = React.forwardRef(function FormTextArea(
  { name, disabled, isValid, isInvalid, withinMultipleFieldsGroup, ...props }: FormTextAreaProps,
  ref
) {
  return (
    <FormElementLayout
      withinMultipleFieldsGroup={withinMultipleFieldsGroup}
      isInvalid={isInvalid}
      isValid={isValid}>
      <FormBS.Control
        as="textarea"
        rows={5}
        disabled={disabled}
        name={name}
        isValid={isValid}
        isInvalid={isInvalid}
        ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
        {...props}
      />
    </FormElementLayout>
  )
})
