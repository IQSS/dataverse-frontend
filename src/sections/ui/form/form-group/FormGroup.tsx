import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './FormInput'
import { FormLabel } from './FormLabel'
import { Row } from '../../grid/Row'

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

export { FormGroup }
