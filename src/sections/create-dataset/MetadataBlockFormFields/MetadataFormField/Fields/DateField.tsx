import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isInvalid: boolean
  disabled: boolean
  isInFieldGroup?: boolean
}
//TODO:ME Date component?? Add validation for dates?
export const DateField = ({
  name,
  onChange,
  isInvalid,
  disabled,
  isInFieldGroup = false
}: Props) => {
  return (
    <Form.Group.Input
      type="text"
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      withinMultipleFieldsGroup={isInFieldGroup}
    />
  )
}
