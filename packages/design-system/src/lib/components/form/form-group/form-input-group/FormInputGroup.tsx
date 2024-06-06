import { ReactNode } from 'react'
import { InputGroup } from 'react-bootstrap'
import { FormInputGroupText } from './FormInputGroupText'

function FormInputGroup({ children }: { children: ReactNode }) {
  return <InputGroup className="mb-3">{children}</InputGroup>
}

FormInputGroup.Text = FormInputGroupText

export { FormInputGroup }
