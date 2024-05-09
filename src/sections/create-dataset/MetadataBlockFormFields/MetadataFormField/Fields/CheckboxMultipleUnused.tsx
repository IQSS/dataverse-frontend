import { ForwardedRef, forwardRef, useState } from 'react'
import { Control, Controller, FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Form } from '@iqss/dataverse-design-system'

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
export const CheckboxMultiple = forwardRef(function CheckboxMultiple(
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
        // className={styles['checkbox-list-grid']}
        data-testid="vocabulary-multiple"
        tabIndex={0}
        ref={ref as ForwardedRef<HTMLDivElement>}>
        {options.map((value) => (
          <Controller
            key={value}
            name={name}
            control={control}
            rules={{
              required: isRequired
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
      <p
      // className={styles['checkbox-group-feedback']}
      >
        {t('datasetForm.field.required', { displayName })}
      </p>
    </Form.CheckboxGroup>
  )
})

/*
 Styles👇
 .checkbox-list-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 260px;
  padding: 1rem;
  overflow-y: auto;
  border: solid 1px var(--bs-gray-400);
  border-radius: var(--bs-border-radius-lg);
}

.checkbox-group-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  color: var(--bs-danger);
  font-size: 0.875em;
}

.checkbox-list-grid:has(:global .form-check-input.is-invalid) {
  border-color: var(--bs-danger);

  + .checkbox-group-feedback {
    display: block;
  }
}

.checkbox-list-grid:focus:not(:global .form-check-input.is-invalid),
.checkbox-list-grid:focus-within:not(:global .form-check-input.is-invalid) {
  border-color: rgba(#{var(--bs-primary-rgb)}, 0.5);
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(#{var(--bs-primary-rgb)}, 0.25);
}

.checkbox-list-grid:has(:global .form-check-input.is-invalid):focus,
.checkbox-list-grid:has(:global .form-check-input.is-invalid):focus-within {
  border-color: var(--bs-danger);
  outline: 0;
  box-shadow: 0 0 0 0.25rem rgba(#{var(--bs-danger-rgb)}, 0.25);
}
*/
