import { Col, Form } from '@iqss/dataverse-design-system'
import { Controller, useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

const filesSearchFields = [
  'name',
  'description',
  'fileType',
  'dataFilePersistentId',
  'variableName',
  'variableLabel',
  'fileTags'
] as const

export const FilesSearchFields = () => {
  const { t } = useTranslation('advancedSearch', { keyPrefix: 'files' })
  const { control } = useFormContext()

  return (
    <>
      {filesSearchFields.map((fieldName) => (
        <Form.Group controlId={`files.${fieldName}`} key={fieldName}>
          <Form.Group.Label
            message={t(`${fieldName}.description`)}
            column
            sm={4}
            className="text-sm-end">
            {t(`${fieldName}.label`)}
          </Form.Group.Label>
          <Controller
            name={`files.${fieldName}`}
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
    </>
  )
}
