import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './FormInput'
import { FormLabel } from './FormLabel'
import { Row } from '../../grid/Row'

function FormGroup({ children }: PropsWithChildren) {
  return (
    <FormBS.Group className="mb-3" as={Row}>
      {children}
    </FormBS.Group>
  )
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput

export { FormGroup }
