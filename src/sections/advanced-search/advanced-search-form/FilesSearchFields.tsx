import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'
import { SearchFields } from '@/search/domain/models/SearchFields'

export const FilesSearchFields = () => {
  const { t } = useTranslation('advancedSearch', { keyPrefix: 'files' })
  const { control } = useFormContext()

  const rules: (localeKey: string) => UseControllerProps['rules'] = (localeKey: string) => ({
    maxLength: {
      value: 100,
      message: t(`${localeKey}.invalid.maxLength`, { maxLength: 100 })
    }
  })

  return (
    <>
      <Form.Group controlId={`files.${SearchFields.FILE_NAME}`}>
        <Form.Group.Label message={t('name.description')} column sm={4} className="text-sm-end">
          {t('name.label')}
        </Form.Group.Label>
        <Controller
          name={`files.${SearchFields.FILE_NAME}`}
          control={control}
          rules={rules('name')}
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

      <Form.Group controlId={`files.${SearchFields.FILE_DESCRIPTION}`}>
        <Form.Group.Label
          message={t('description.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('description.label')}
        </Form.Group.Label>
        <Controller
          name={`files.${SearchFields.FILE_DESCRIPTION}`}
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

      <Form.Group controlId={`files.${SearchFields.FILE_TYPE_SEARCHABLE}`}>
        <Form.Group.Label message={t('fileType.description')} column sm={4} className="text-sm-end">
          {t('fileType.label')}
        </Form.Group.Label>
        <Controller
          name={`files.${SearchFields.FILE_TYPE_SEARCHABLE}`}
          control={control}
          rules={rules('fileType')}
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

      <Form.Group controlId={`files.${SearchFields.FILE_PERSISTENT_ID}`}>
        <Form.Group.Label
          message={t('dataFilePersistentId.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('dataFilePersistentId.label')}
        </Form.Group.Label>
        <Controller
          name={`files.${SearchFields.FILE_PERSISTENT_ID}`}
          control={control}
          rules={rules('dataFilePersistentId')}
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

      <Form.Group controlId={`files.${SearchFields.VARIABLE_NAME}`}>
        <Form.Group.Label
          message={t('variableName.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('variableName.label')}
        </Form.Group.Label>
        <Controller
          name={`files.${SearchFields.VARIABLE_NAME}`}
          control={control}
          rules={rules('variableName')}
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

      <Form.Group controlId={`files.${SearchFields.VARIABLE_LABEL}`}>
        <Form.Group.Label
          message={t('variableLabel.description')}
          column
          sm={4}
          className="text-sm-end">
          {t('variableLabel.label')}
        </Form.Group.Label>
        <Controller
          name={`files.${SearchFields.VARIABLE_LABEL}`}
          control={control}
          rules={rules('variableLabel')}
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

      <Form.Group controlId={`files.${SearchFields.FILE_TAG_SEARCHABLE}`}>
        <Form.Group.Label message={t('fileTags.description')} column sm={4} className="text-sm-end">
          {t('fileTags.label')}
        </Form.Group.Label>
        <Controller
          name={`files.${SearchFields.FILE_TAG_SEARCHABLE}`}
          control={control}
          rules={rules('fileTags')}
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
    </>
  )
}
