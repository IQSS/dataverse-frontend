import { ForwardedRef, forwardRef, useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'
import styles from '../index.module.scss'

interface Props {
  title: string
  name: string
  displayName: string
  description: string
  options: string[]
  control: Control<FieldValues, unknown>
  isRequired: boolean
}
// TODO: Change for a multiple select with search
export const VocabularyMultiple = forwardRef(function VocabularyMultiple(
  { title, name, displayName, description, options, control, isRequired }: Props,
  ref
) {
  const { t } = useTranslation('createDataset')
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
            name={name}
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
                id={`${name}-checkbox-${value}`}
                value={value}
                onChange={() => handleChange(value, (newValue) => field.onChange(newValue))}
                isInvalid={invalid}
                ref={field.ref}
                key={value}
              />
            )}
          />
        ))}
      </div>
      <p className={styles['checkbox-group-feedback']}>
        {t('datasetForm.field.required', { displayName })}
      </p>
    </Form.CheckboxGroup>
  )
})
