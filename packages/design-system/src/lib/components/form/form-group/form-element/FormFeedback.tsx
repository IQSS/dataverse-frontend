import { FormControl } from 'react-bootstrap'
import { PropsWithChildren } from 'react'
import { Col, ColProps } from '../../../grid/Col'
import { Row } from '../../../grid/Row'

interface FormFeedbackProps extends ColProps {
  type?: 'valid' | 'invalid'
  as?: typeof Col | typeof Row
}

export function FormFeedback({
  type = 'valid',
  as,
  children,
  ...props
}: PropsWithChildren<FormFeedbackProps>) {
  return (
    <FormControl.Feedback type={type} as={as} {...props}>
      {children}
    </FormControl.Feedback>
  )
}
