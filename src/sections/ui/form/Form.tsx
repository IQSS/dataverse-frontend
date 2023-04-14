import { PropsWithChildren } from 'react'
import { FormGroup } from './form-group/FormGroup'
import { Form as FormBS } from 'react-bootstrap'

function Form({ children }: PropsWithChildren) {
  return <FormBS>{children}</FormBS>
}

Form.Group = FormGroup

export { Form }
