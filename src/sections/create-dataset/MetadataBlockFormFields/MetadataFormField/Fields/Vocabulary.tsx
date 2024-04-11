import { Form } from '@iqss/dataverse-design-system'
import { forwardRef } from 'react'

interface Props {
  options: string[]
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void
  isInvalid: boolean
}
// TODO: Implement a multiple select with autocomplete like in JSF version
export const Vocabulary = forwardRef(function Vocabulary(
  { options, onChange, isInvalid, ...props }: Props,
  ref
) {
  return (
    <Form.Group.Select onChange={onChange} isInvalid={isInvalid} ref={ref} {...props}>
      <option value="">Select</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </Form.Group.Select>
  )
})
