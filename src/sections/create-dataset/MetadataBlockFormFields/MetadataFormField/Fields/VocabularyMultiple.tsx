import { ForwardedRef, forwardRef, useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { Form } from '@iqss/dataverse-design-system'
import styles from '../index.module.scss'

interface Props {
  title: string
  mainName: string
  description: string
  options: string[]
  control: Control<FieldValues, unknown>
  isRequired: boolean
  disabled: boolean
}
// TODO: Change for a multiple select with search
export const VocabularyMultiple = forwardRef(function VocabularyMultiple(
  { title, mainName, description, options, control, isRequired, disabled }: Props,
  ref
) {
  const [checkedOptions, setCheckedOptions] = useState<string[]>([])

  const handleChange = (value: string, fieldOnChange: (value: string[]) => void) => {
    if (checkedOptions.includes(value)) {
      setCheckedOptions(checkedOptions.filter((option) => option !== value))
      fieldOnChange(checkedOptions.filter((option) => option !== value))
    } else {
      setCheckedOptions([...checkedOptions, value])
      fieldOnChange([...checkedOptions, value])
    }
  }

  return (
    <Form.CheckboxGroup title={title} message={description} required={isRequired}>
      <div
        className={styles['checkbox-list-grid']}
        data-testid="vocabulary-multiple"
        tabIndex={0}
        ref={ref as ForwardedRef<HTMLDivElement>}>
        {options.map((value) => (
          <Controller
            key={value}
            name={mainName}
            control={control}
            rules={{
              required: isRequired,
              validate: (value) => {
                if (isRequired && Array.isArray(value) && value.length === 0) {
                  return 'This field is required'
                }
                return true
              }
            }}
            render={({ field, fieldState: { invalid } }) => (
              <Form.Group.Checkbox
                label={value}
                id={`${mainName}-checkbox-${value}`}
                value={value}
                onChange={() => handleChange(value, (newValue) => field.onChange(newValue))}
                disabled={disabled}
                isInvalid={invalid}
                key={value}
              />
            )}
          />
        ))}
      </div>
    </Form.CheckboxGroup>
  )
})
