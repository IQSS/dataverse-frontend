import React, { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './FormInput'
import { FormLabel } from './FormLabel'
import { FormText } from './FormText'
import { FormSelect } from './FormSelect'
import { FormTextArea } from './FormTextArea'
import { Col } from '../../grid/Col'
import { Row } from '../../grid/Row'

interface FormGroupProps {
  as?: typeof Col | typeof Row
  required?: boolean
  controlId: string
}

function FormGroup({ as = Row, required, controlId, children }: PropsWithChildren<FormGroupProps>) {
  const childrenWithRequiredProp = React.Children.map(children as JSX.Element, (child) => {
    return React.cloneElement(child, {
      required: required,
      withinMultipleFieldsGroup: as === Col
    })
  })

  return (
    <FormBS.Group controlId={controlId} className="mb-3" as={as}>
      {childrenWithRequiredProp}
    </FormBS.Group>
  )
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput
FormGroup.Select = FormSelect
FormGroup.TextArea = FormTextArea
FormGroup.Text = FormText

export { FormGroup }
