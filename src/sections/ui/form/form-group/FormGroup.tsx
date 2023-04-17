import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './FormInput'
import { FormLabel } from './FormLabel'
import { Row } from '../../grid/Row'
import { FormText } from './FormText'
import { FormSelect } from './FormSelect'

interface FormGroupProps {
  controlId: string
}

function FormGroup({ controlId, children }: PropsWithChildren<FormGroupProps>) {
  return (
    <FormBS.Group controlId={controlId} className="mb-3" as={Row}>
      {children}
    </FormBS.Group>
  )
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput
FormGroup.Select = FormSelect
FormGroup.Text = FormText

export { FormGroup }
