import { Form } from '@iqss/dataverse-design-system'
import { forwardRef } from 'react'

interface Props {
  name: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  isInvalid: boolean
  disabled: boolean
  placeholder: string
}

export const TextBoxField = forwardRef(function TextBoxField(
  { name, onChange, isInvalid, disabled, placeholder, ...props }: Props,
  ref
) {
  return (
    <Form.Group.TextArea
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  )
})
