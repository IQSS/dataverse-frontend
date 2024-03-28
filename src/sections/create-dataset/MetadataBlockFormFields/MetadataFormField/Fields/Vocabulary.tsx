import { Form } from '@iqss/dataverse-design-system'

interface Props {
  name: string
  options: string[]
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  isInvalid: boolean
  disabled: boolean
}
// TODO: Implement a multiple select with autocomplete like in JSF version
export const Vocabulary = ({
  name,
  options,
  onChange,
  isInvalid: _isInvalid, //TODO:ME: Why isInvalid complaining?
  disabled,
  ...props
}: Props) => {
  return (
    <Form.Group.Select
      name={name}
      disabled={disabled}
      onChange={onChange}
      // isInvalid={isInvalid}
      {...props}>
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Form.Group.Select>
  )
}
