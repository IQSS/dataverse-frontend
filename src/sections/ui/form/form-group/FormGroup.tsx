import React, { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './FormInput'
import { FormLabel } from './FormLabel'
import { Row } from '../../grid/Row'
import { FormText } from './FormText'
import { FormSelect } from './FormSelect'

interface FormGroupProps {
  required?: boolean
  controlId: string
}

function FormGroup({ required, controlId, children }: PropsWithChildren<FormGroupProps>) {
  const childrenWithRequiredProp = React.Children.map(children as JSX.Element, (child) => {
    return React.cloneElement(child, {
      required: required
    })
  })

  return (
    <FormBS.Group controlId={controlId} className="mb-3" as={Row}>
      {childrenWithRequiredProp}
    </FormBS.Group>
  )
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput
FormGroup.Select = FormSelect
FormGroup.Text = FormText

export { FormGroup }
