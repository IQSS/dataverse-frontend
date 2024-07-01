import { Form } from 'react-bootstrap'

/**
 * ## Description
 * Simple multi-select component
 */
interface MultiSelectProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string[]
  options: string[]
  setSelected: (values: string[]) => void
}

export function MultiSelectClassic({ value, options, setSelected }: MultiSelectProps) {
  return (
    <Form.Select
      value={value}
      multiple={true}
      onChange={(e) => {
        const options = [...e.target.selectedOptions]
        const values = options.map((option) => option.value)
        setSelected(values)
      }}>
      {options.map((o) => (
        <option value={o} key={o}>
          {o}
        </option>
      ))}
    </Form.Select>
  )
}
