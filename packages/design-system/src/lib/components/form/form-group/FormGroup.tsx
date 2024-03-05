import React, { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './form-element/FormInput'
import { FormLabel } from './form-element/FormLabel'
import { FormText } from './form-element/FormText'
import { FormSelect } from './form-element/FormSelect'
import { FormTextArea } from './form-element/FormTextArea'
import { Col, ColProps } from '../../grid/Col'
import { Row } from '../../grid/Row'
import { FormCheckbox } from './form-element/FormCheckbox'
import { FormFeedback } from './form-element/FormFeedback'

interface FormGroupProps extends ColProps {
  as?: typeof Col | typeof Row
  required?: boolean
  controlId: string
  fieldIndex?: string
}

function FormGroup({
  as = Row,
  required,
  controlId,
  fieldIndex,
  children,
  ...props
}: PropsWithChildren<FormGroupProps>) {
  const childrenWithRequiredProp = React.Children.map(children as JSX.Element, (child) => {
    return React.cloneElement(child, {
      required: required,
      withinMultipleFieldsGroup: as === Col
    })
  })

  return (
    <FormBS.Group
      controlId={fieldIndex ? `${controlId}-${fieldIndex}` : controlId}
      className="mb-3"
      as={as}
      {...props}>
      {childrenWithRequiredProp}
    </FormBS.Group>
  )
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput
FormGroup.Select = FormSelect
FormGroup.TextArea = FormTextArea
FormGroup.Text = FormText
FormGroup.Checkbox = FormCheckbox
FormGroup.Feedback = FormFeedback

export { FormGroup }
