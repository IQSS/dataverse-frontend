import { Form } from '@iqss/dataverse-design-system'
import { forwardRef } from 'react'

interface Props {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  placeholder: string
}

export const DateField = forwardRef(function DateField(
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
      data-testid="date-field"
      {...props}
    />
  )
})
