import { Form } from '@iqss/dataverse-design-system'
import { forwardRef } from 'react'

interface Props {
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  isInvalid: boolean
  placeholder: string
}

export const TextBoxField = forwardRef(function TextBoxField(
  { onChange, isInvalid, placeholder, ...props }: Props,
  ref
) {
  return (
    <Form.Group.TextArea
      onChange={onChange}
      isInvalid={isInvalid}
      placeholder={placeholder}
      ref={ref}
      {...props}
    />
  )
})
