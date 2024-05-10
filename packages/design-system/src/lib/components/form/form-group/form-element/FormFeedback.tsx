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
  // return withinMultipleFieldsGroup ? (
  //   <FormControl.Feedback type={type}>{children}</FormControl.Feedback>
  // ) : (
  //   <FormControl.Feedback as={Col} sm={{ offset: 3 }} type={type}>
  //     {children}
  //   </FormControl.Feedback>
  // )
}
