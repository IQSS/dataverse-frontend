import { PropsWithChildren } from 'react'
import { Form as FormBS } from 'react-bootstrap'
import { FormInput } from './form-input/FormInput'
import { FormLabel } from './form-label/FormLabel'

function FormGroup({ children }: PropsWithChildren) {
  return <FormBS.Group>{children}</FormBS.Group>
}

FormGroup.Label = FormLabel
FormGroup.Input = FormInput

export { FormGroup }
