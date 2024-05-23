import { ReactNode } from 'react'
import { InputGroup } from 'react-bootstrap'

export function FormInputGroupText({ children }: { children: ReactNode }) {
  return <InputGroup.Text>{children}</InputGroup.Text>
}
