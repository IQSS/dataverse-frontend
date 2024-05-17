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
import { FormSelectMultiple } from './form-element/FormSelectMultiple'

interface FormGroupProps extends ColProps {
  as?: typeof Col | typeof Row
  required?: boolean
  controlId?: string
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
  const childrenWithRequiredProp = cloneThroughFragments(children, required, as)

  return (
    <FormBS.Group
      controlId={controlId ? (fieldIndex ? `${controlId}-${fieldIndex}` : controlId) : undefined}
      className="mb-3"
      as={as}
      {...props}>
      {childrenWithRequiredProp}
    </FormBS.Group>
  )
}
function cloneThroughFragments(
  children: React.ReactNode,
  required?: boolean,
  as?: typeof Col | typeof Row
): React.ReactNode {
  return React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === React.Fragment) {
        const hasChildren = (props: unknown): props is { children: React.ReactNode } =>
          typeof props === 'object' && Object.hasOwnProperty.call(props, 'children')

        if (hasChildren(child.props)) {
          return cloneThroughFragments(child.props.children, required, as)
        }
      }
      return React.cloneElement(child as React.ReactElement, {
        required: required,
        withinMultipleFieldsGroup: as === Col
      })
    }
    return child
  })
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput
FormGroup.Select = FormSelect
FormGroup.SelectMultiple = FormSelectMultiple
FormGroup.TextArea = FormTextArea
FormGroup.Text = FormText
FormGroup.Checkbox = FormCheckbox
FormGroup.Feedback = FormFeedback

export { FormGroup }
