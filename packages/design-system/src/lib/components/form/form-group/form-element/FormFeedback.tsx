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
  const Layout = ({ children }: PropsWithChildren) => {
    return withinMultipleFieldsGroup ? (
      <>{children}</>
    ) : (
      <Col sm={{ offset: 3, span: 9 }} className="mt-2">
        {children}
      </Col>
    )
  }

  return (
    <FormControl.Feedback type={type}>
      <Layout>{children} </Layout>
    </FormControl.Feedback>
  )
}
