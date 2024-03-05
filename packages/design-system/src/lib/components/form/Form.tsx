import { FormEvent, PropsWithChildren } from 'react'
import { FormGroup } from './form-group/FormGroup'
import { Form as FormBS } from 'react-bootstrap'
import { FormGroupWithMultipleFields } from './form-group-multiple-fields/FormGroupWithMultipleFields'
import { FormInputGroup } from './form-group/form-input-group/FormInputGroup'

interface FormProps {
  className?: string
  validated?: boolean
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void
}

function Form({ validated, onSubmit, children, className }: PropsWithChildren<FormProps>) {
  return (
    <FormBS validated={validated} onSubmit={onSubmit} className={className} noValidate={true}>
      {children}
    </FormBS>
  )
}

Form.InputGroup = FormInputGroup
Form.Group = FormGroup
Form.GroupWithMultipleFields = FormGroupWithMultipleFields

export { Form }
