import { Form } from '@iqss/dataverse-design-system'
import styles from '../index.module.scss'

interface Props {
  title: string
  name: string
  description: string
  options: string[]
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  isRequired: boolean
  isInvalid: boolean
  disabled: boolean
}

export const VocabularyMultiple = ({
  title,
  name,
  description,
  options,
  onChange,
  isRequired,
  isInvalid,
  disabled
}: Props) => {
  return (
    <Form.CheckboxGroup
      title={title}
      message={description}
      required={isRequired}
      isInvalid={isInvalid}>
      <div className={styles['checkbox-list-grid']} data-testid="vocabulary-multiple">
        {options.map((value) => (
          <Form.Group.Checkbox
            name={name}
            label={value}
            id={`${name}-checkbox-${value}`}
            value={value}
            onChange={onChange}
            disabled={disabled}
            isInvalid={isInvalid}
            key={value}
          />
        ))}
      </div>
    </Form.CheckboxGroup>
  )
}
