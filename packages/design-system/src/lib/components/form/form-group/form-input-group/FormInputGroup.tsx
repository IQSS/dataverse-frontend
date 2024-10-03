import { ReactNode } from 'react'
import { InputGroup } from 'react-bootstrap'
import { FormInputGroupText } from './FormInputGroupText'

interface FormInputGroupProps {
  children: ReactNode
  hasValidation?: boolean
  className?: string
}

function FormInputGroup({ children, hasValidation, className = '' }: FormInputGroupProps) {
  return (
    <InputGroup className={`mb-3 ${className}`} hasValidation={hasValidation}>
      {children}
    </InputGroup>
  )
}

FormInputGroup.Text = FormInputGroupText

export { FormInputGroup }
