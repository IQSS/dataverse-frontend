import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  disabled: boolean
  isInFieldGroup?: boolean
}

export const TextBoxField = ({
  name,
  onChange,
  isInvalid,
  disabled,
  isInFieldGroup = false
}: Props) => {
  return (
    <Form.Group.TextArea
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      withinMultipleFieldsGroup={isInFieldGroup}
    />
  )
}
