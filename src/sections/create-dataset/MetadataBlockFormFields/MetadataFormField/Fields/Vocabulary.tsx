import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  options: string[]
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  isInvalid: boolean
  disabled: boolean
  isInFieldGroup?: boolean
  // allowMultiple?: boolean
}
// TODO: Implement a multiple select with autocomplete like in JSF version
export const Vocabulary = ({
  name,
  options,
  onChange,
  isInvalid,
  disabled,
  // allowMultiple,
  isInFieldGroup = false
}: Props) => {
  return (
    <Form.Group.Select
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      withinMultipleFieldsGroup={isInFieldGroup}>
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Form.Group.Select>
  )
}
