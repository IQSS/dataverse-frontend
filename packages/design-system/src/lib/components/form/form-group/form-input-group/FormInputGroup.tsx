import React, { PropsWithChildren } from 'react'
import { InputGroup } from 'react-bootstrap'
import { FormInputGroupText } from './FormInputGroupText'
import { Col } from '../../../grid/Col'

interface FormInputGroupProps {
  hasVisibleLabel?: boolean
}

function FormInputGroup({ hasVisibleLabel, children }: PropsWithChildren<FormInputGroupProps>) {
  const childrenInsideGroup = React.Children.map(children as JSX.Element, (child) => {
    return React.cloneElement(child, {
      withinMultipleFieldsGroup: true
    })
  })

  return hasVisibleLabel ? (
    <Col sm={9}>
      <InputGroup className="mb-3">{childrenInsideGroup}</InputGroup>
    </Col>
  ) : (
    <InputGroup className="mb-3">{childrenInsideGroup}</InputGroup>
  )
}

FormInputGroup.Text = FormInputGroupText

export { FormInputGroup }
