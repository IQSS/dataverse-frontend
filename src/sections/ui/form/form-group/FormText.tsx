import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { Col } from '../../grid/Col'

export function FormText({ children }: PropsWithChildren) {
  return (
    <Col sm={{ offset: 3, span: 9 }} className="mt-2">
      <FormBS.Text muted>{children}</FormBS.Text>
    </Col>
  )
}
