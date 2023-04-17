import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { Col } from '../../grid/Col'

interface FormSelectProps {
  required?: boolean
}

export function FormSelect({ required, children }: PropsWithChildren<FormSelectProps>) {
  return (
    <Col sm={9}>
      <FormBS.Select required={required}>{children}</FormBS.Select>
    </Col>
  )
}
