import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { Col } from '../../grid/Col'

export function FormSelect({ children }: PropsWithChildren) {
  return (
    <Col sm={9}>
      <FormBS.Select>{children}</FormBS.Select>
    </Col>
  )
}
