import { Form } from '@iqss/dataverse-design-system'
import { forwardRef } from 'react'

interface Props {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  disabled: boolean
  placeholder: string
}
//TODO:ME  Add validation for urls?
export const UrlField = forwardRef(function UrlField(
  { name, onChange, isInvalid, disabled, placeholder, ...props }: Props,
  ref
) {
  return (
    <Form.Group.Input
      type="text"
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      placeholder={placeholder}
      ref={ref}
      data-testid="url-field"
      {...props}
    />
  )
})
