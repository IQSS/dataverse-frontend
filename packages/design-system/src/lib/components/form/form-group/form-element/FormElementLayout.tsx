import { PropsWithChildren } from 'react'
import { Col } from '../../../grid/Col'

interface LayoutFormGroupElementProps {
  withinMultipleFieldsGroup?: boolean
  isValid?: boolean
  isInvalid?: boolean
}
export function FormElementLayout({
  withinMultipleFieldsGroup,
  isValid,
  isInvalid,
  children
}: PropsWithChildren<LayoutFormGroupElementProps>) {
  const className = isInvalid ? 'is-invalid' : isValid ? 'is-valid' : ''
  return withinMultipleFieldsGroup ? (
    <>{children}</>
  ) : (
    <Col sm={9} className={className}>
      {children}
    </Col>
  )
}
