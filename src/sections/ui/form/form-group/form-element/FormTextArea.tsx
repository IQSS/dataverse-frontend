import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormElementLayout } from './FormElementLayout'
import * as React from 'react'

export type FormInputElement = HTMLInputElement | HTMLTextAreaElement
interface FormTextAreaProps extends React.HTMLAttributes<FormInputElement> {
  withinMultipleFieldsGroup?: boolean
}

export function FormTextArea({
  withinMultipleFieldsGroup,
  children,
  ...props
}: PropsWithChildren<FormTextAreaProps>) {
  return (
    <FormElementLayout withinMultipleFieldsGroup={withinMultipleFieldsGroup}>
      <FormBS.Control as="textarea" rows={5} {...props}>
        {children}
      </FormBS.Control>
    </FormElementLayout>
  )
}
