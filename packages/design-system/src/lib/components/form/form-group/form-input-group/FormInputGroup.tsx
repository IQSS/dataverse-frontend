import { ReactNode } from 'react'
import { InputGroup } from 'react-bootstrap'
import { FormInputGroupText } from './FormInputGroupText'

interface FormInputGroupProps {
  children: ReactNode
  hasValidation?: boolean
}

function FormInputGroup({ children, hasValidation }: FormInputGroupProps) {
  return (
    <InputGroup className="mb-3" hasValidation={hasValidation}>
      {children}
    </InputGroup>
  )
}

FormInputGroup.Text = FormInputGroupText

export { FormInputGroup }
