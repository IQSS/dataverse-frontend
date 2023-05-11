import { FormEvent, PropsWithChildren } from 'react'
import { FormGroup } from './form-group/FormGroup'
import { Form as FormBS } from 'react-bootstrap'
import { FormGroupWithMultipleFields } from './form-group-multiple-fields/FormGroupWithMultipleFields'

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

Form.Group = FormGroup
Form.GroupWithMultipleFields = FormGroupWithMultipleFields

export { Form }
