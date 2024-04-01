import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  isInvalid: boolean
  disabled: boolean
  placeholder: string
}

export const TextBoxField = ({
  name,
  onChange,
  isInvalid,
  disabled,
  placeholder,
  ...props
}: Props) => {
  return (
    <Form.Group.TextArea
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      placeholder={placeholder}
      {...props}
    />
  )
}
