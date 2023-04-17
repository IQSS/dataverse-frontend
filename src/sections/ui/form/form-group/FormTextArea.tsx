import { PropsWithChildren } from 'react'
import { Col } from '../../grid/Col'
import { Form as FormBS } from 'react-bootstrap'

interface FormTextAreaProps {
  required?: boolean
}

export function FormTextArea({ required, children }: PropsWithChildren<FormTextAreaProps>) {
  return (
    <Col sm={9}>
      <FormBS.Control as="textarea" rows={5} required={required}>
        {children}
      </FormBS.Control>
    </Col>
  )
}
