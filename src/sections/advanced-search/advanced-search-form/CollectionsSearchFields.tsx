import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'
import { SearchFields } from '@/search/domain/models/SearchFields'

interface CollectionsSearchFieldsProps {
  subjectControlledVocabulary: string[]
}

export const CollectionsSearchFields = ({
  subjectControlledVocabulary
}: CollectionsSearchFieldsProps) => {
  const { t } = useTranslation('advancedSearch', { keyPrefix: 'collections' })
  const { control } = useFormContext()

  const rules: (localeKey: string) => UseControllerProps['rules'] = (localeKey: string) => ({
    maxLength: {
      value: 100,
      message: t(`${localeKey}.invalid.maxLength`, { maxLength: 100 })
    }
  })

  return (
    <div>
      <Form.Group controlId={`collections.${SearchFields.DATAVERSE_NAME}`}>
        <Form.Group.Label message={t('name.description')} column sm={4} className="text-sm-end">
          {t('name.label')}
        </Form.Group.Label>
        <Controller
          name={`collections.${SearchFields.DATAVERSE_NAME}`}
          control={control}
          rules={rules('name')}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <Col sm={6}>
              <Form.Group.Input
                type="text"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                autoFocus
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </Col>
          )}
        />
      </Form.Group>

      <Form.Group controlId={`collections.${SearchFields.DATAVERSE_ALIAS}`}>
        <Form.Group.Label message={t('alias.description')} column sm={4} className="text-sm-end">
          {t('alias.label')}
        </Form.Group.Label>

        <Controller
          name={`collections.${SearchFields.DATAVERSE_ALIAS}`}
          control={control}
          rules={rules('alias')}
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

      <Form.Group controlId={`collections.${SearchFields.DATAVERSE_AFFILIATION}`}>
        <Form.Group.Label
          message={t('affiliation.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('affiliation.label')}
        </Form.Group.Label>
        <Controller
          name={`collections.${SearchFields.DATAVERSE_AFFILIATION}`}
          control={control}
          rules={rules('affiliation')}
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

      <Form.Group controlId={`collections.${SearchFields.DATAVERSE_DESCRIPTION}`}>
        <Form.Group.Label
          message={t('description.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('description.label')}
        </Form.Group.Label>
        <Controller
          name={`collections.${SearchFields.DATAVERSE_DESCRIPTION}`}
          control={control}
          rules={rules('description')}
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
          name={`collections.${SearchFields.DATAVERSE_SUBJECT}`}
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
    </div>
  )
}
