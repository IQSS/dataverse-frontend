import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext, useWatch } from 'react-hook-form'
import { Button, Col, Form } from '@iqss/dataverse-design-system'
import { CheckCircle } from 'react-bootstrap-icons'
import styles from '../CollectionForm.module.scss'

interface IdentifierFieldProps {
  rules: UseControllerProps['rules']
}

export const IdentifierField = ({ rules }: IdentifierFieldProps) => {
  const { t } = useTranslation('newCollection')
  const { control, setValue } = useFormContext()
  const nameFieldValue = useWatch({ name: 'name' }) as string

  const collectionNameToAlias = (name: string) => {
    if (!name) return ''

    return name
      .toLowerCase() // Convert to lowercase
      .trim() // Remove leading/trailing whitespace
      .replace(/[^\w\s-]/g, '') // Remove non-alphanumeric characters except for spaces and hyphens
      .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .slice(0, 60) // Limit to 60 characters
  }

  const aliasSuggestion = useMemo(() => collectionNameToAlias(nameFieldValue), [nameFieldValue])

  const applyAliasSuggestion = () =>
    setValue('alias', aliasSuggestion, { shouldValidate: true, shouldDirty: true })

  return (
    <Form.Group controlId="identifier" as={Col} md={6} className={styles['identifier-field-group']}>
      <Form.Group.Label message={t('fields.alias.description')} required={true}>
        {t('fields.alias.label')}
      </Form.Group.Label>

      <Controller
        name="alias"
        control={control}
        rules={rules}
        render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
          <Col>
            <Form.InputGroup hasValidation>
              <Form.InputGroup.Text>{window.location.origin}/spa/collections/</Form.InputGroup.Text>
              <Form.Group.Input
                type="text"
                aria-label="identifier"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                aria-required={true}
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Form.InputGroup>

            {aliasSuggestion !== '' && value !== aliasSuggestion && !invalid && (
              <div className={styles['suggestion-container']}>
                <Form.Group.Text>
                  {t('fields.alias.suggestion')} 👉 <strong>{aliasSuggestion}</strong>
                </Form.Group.Text>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  icon={<CheckCircle size={16} color="green" />}
                  onClick={applyAliasSuggestion}
                  className={styles['apply-suggestion-btn']}
                  aria-label="Apply suggestion"
                />
              </div>
            )}
          </Col>
        )}
      />
    </Form.Group>
  )
}
