import { FormControl } from 'react-bootstrap'
import { PropsWithChildren } from 'react'
import { Col } from '../../../grid/Col'

interface FormFeedbackProps {
  type?: 'valid' | 'invalid'
  withinMultipleFieldsGroup?: boolean
}

export function FormFeedback({
  type = 'valid',
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<FormFeedbackProps>) {
  return withinMultipleFieldsGroup ? (
    <FormControl.Feedback type={type}>{children}</FormControl.Feedback>
  ) : (
    <FormControl.Feedback as={Col} sm={{ offset: 3, span: 9 }} type={type}>
      {children}
    </FormControl.Feedback>
  )
}
