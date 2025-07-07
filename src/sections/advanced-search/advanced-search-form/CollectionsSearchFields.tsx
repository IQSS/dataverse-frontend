import { useTranslation } from 'react-i18next'
import { Controller, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'

const textCollectionsSearchFields = ['name', 'alias', 'affiliation', 'description'] as const

interface CollectionsSearchFieldsProps {
  subjectControlledVocabulary: string[]
}

export const CollectionsSearchFields = ({
  subjectControlledVocabulary
}: CollectionsSearchFieldsProps) => {
  const { t } = useTranslation('advancedSearch', { keyPrefix: 'collections' })
  const { control } = useFormContext()

  return (
    <>
      {textCollectionsSearchFields.map((fieldName) => (
        <Form.Group controlId={`collections.${fieldName}`} key={fieldName}>
          <Form.Group.Label
            message={t(`${fieldName}.description`)}
            column
            sm={4}
            className="text-sm-end">
            {t(`${fieldName}.label`)}
          </Form.Group.Label>
          <Controller
            name={`collections.${fieldName}`}
            control={control}
            rules={{
              maxLength: {
                value: 100,
                message: t(`${fieldName}.invalid.maxLength`, { maxLength: 100 })
              }
            }}
            render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
              <Col sm={6}>
                <Form.Group.Input
                  type="text"
                  value={value as string}
                  onChange={onChange}
                  isInvalid={invalid}
                  ref={ref}
                />
                <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
              </Col>
            )}
          />
        </Form.Group>
      ))}

      <Form.Group>
        <Form.Group.Label
          message={t('subject.description')}
          column
          sm={4}
          className="text-sm-end"
          htmlFor="collections.subject">
          {t('subject.label')}
        </Form.Group.Label>
        <Controller
          name="collections.subject"
          control={control}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Col sm={6}>
              <Form.Group.SelectAdvanced
                defaultValue={value as string[]}
                options={subjectControlledVocabulary}
                isMultiple={true}
                isSearchable={false}
                onChange={onChange}
                isInvalid={invalid}
                ref={ref}
                inputButtonId="collections.subject"
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Col>
          )}
        />
      </Form.Group>
    </>
  )
}
