import { PropsWithChildren } from 'react'
import { Col } from '../../grid/Col'

interface LayoutFormGroupElementProps {
  withinMultipleFieldsGroup?: boolean
}
export function LayoutFormGroupElement({
  withinMultipleFieldsGroup,
  children
}: PropsWithChildren<LayoutFormGroupElementProps>) {
  return withinMultipleFieldsGroup ? <>{children}</> : <Col sm={9}>{children}</Col>
}
