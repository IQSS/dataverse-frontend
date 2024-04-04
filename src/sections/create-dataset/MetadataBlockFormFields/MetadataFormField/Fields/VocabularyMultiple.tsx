import { Form } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import styles from '../index.module.scss'
import { ForwardedRef, forwardRef } from 'react'

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
// TODO: Change for a multiple select with search
export const VocabularyMultiple = forwardRef(function VocabularyMultiple(
  { title, name, description, options, onChange, isRequired, isInvalid, disabled }: Props,
  ref
) {
  return (
    <Form.CheckboxGroup
      title={title}
      message={description}
      required={isRequired}
      isInvalid={isInvalid}>
      <div
        className={cn(styles['checkbox-list-grid'], {
          [styles['invalid']]: isInvalid
        })}
        data-testid="vocabulary-multiple"
        tabIndex={0}
        ref={ref as ForwardedRef<HTMLDivElement>}>
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
})
