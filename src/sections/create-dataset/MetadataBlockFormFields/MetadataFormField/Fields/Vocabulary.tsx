import { Form } from '@iqss/dataverse-design-system'
import { forwardRef } from 'react'

interface Props {
  name: string
  options: string[]
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  isInvalid: boolean
  disabled: boolean
}
// TODO: Implement a multiple select with autocomplete like in JSF version
export const Vocabulary = forwardRef(function Vocabulary(
  { name, options, onChange, isInvalid, disabled, ...props }: Props,
  ref
) {
  return (
    <Form.Group.Select
      name={name}
      disabled={disabled}
      onChange={onChange}
      isInvalid={isInvalid}
      ref={ref}
      {...props}>
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Form.Group.Select>
  )
})
