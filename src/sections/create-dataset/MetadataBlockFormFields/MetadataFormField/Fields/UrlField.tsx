import { Form } from '@iqss/dataverse-design-system'
import { forwardRef } from 'react'

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  placeholder: string
}

export const UrlField = forwardRef(function UrlField(
  { onChange, isInvalid, placeholder, ...props }: Props,
  ref
) {
  return (
    <Form.Group.Input
      type="text"
      onChange={onChange}
      isInvalid={isInvalid}
      placeholder={placeholder}
      ref={ref}
      data-testid="url-field"
      {...props}
    />
  )
})
