import { FormEvent, PropsWithChildren } from 'react'
import { FormGroup } from './form-group/FormGroup'
import { Form as FormBS } from 'react-bootstrap'
import { FormGroupWithMultipleFields } from './form-group-multiple-fields/FormGroupWithMultipleFields'
import { FormInputGroup } from './form-group/form-input-group/FormInputGroup'

interface FormProps {
  validated?: boolean
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}

function Form({ validated, onSubmit, children }: PropsWithChildren<FormProps>) {
  return (
    <FormBS validated={validated} onSubmit={onSubmit}>
      {children}
    </FormBS>
  )
}

Form.InputGroup = FormInputGroup
Form.Group = FormGroup
Form.GroupWithMultipleFields = FormGroupWithMultipleFields

export { Form }
