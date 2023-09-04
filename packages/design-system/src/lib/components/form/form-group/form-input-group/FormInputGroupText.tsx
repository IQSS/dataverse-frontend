import { PropsWithChildren } from 'react'
import { InputGroup } from 'react-bootstrap'

export function FormInputGroupText({ children }: PropsWithChildren) {
  return <InputGroup.Text>{children}</InputGroup.Text>
}
