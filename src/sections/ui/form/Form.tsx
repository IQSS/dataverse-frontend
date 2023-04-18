import { PropsWithChildren } from 'react'
import { FormGroup } from './form-group/FormGroup'
import { Form as FormBS } from 'react-bootstrap'
import { FormGroupWithMultipleFields } from './form-group-multiple-fields/FormGroupWithMultipleFields'

function Form({ children }: PropsWithChildren) {
  return <FormBS>{children}</FormBS>
}

Form.Group = FormGroup
Form.GroupWithMultipleFields = FormGroupWithMultipleFields

export { Form }
