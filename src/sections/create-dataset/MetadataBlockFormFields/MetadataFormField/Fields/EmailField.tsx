import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  disabled: boolean
  placeholder: string
}
// TODO:ME Add validation for emails
export const EmailField = ({
  name,
  onChange,
  isInvalid,
  disabled,
  placeholder,
  ...props
}: Props) => {
  return (
    <Form.Group.Input
      type="text"
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      placeholder={placeholder}
      data-testid="email-field"
      {...props}
    />
  )
}
