import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'

interface FileDescriptionFieldProps {
  itemIndex: number
}

export const FileDescriptionField = ({ itemIndex }: FileDescriptionFieldProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('shared')

  const descriptionRules: UseControllerProps['rules'] = {
    maxLength: {
      value: 255,
      message: t('uploadedFilesList.fields.description.invalid.maxLength', { maxLength: 255 })
    }
  }

  return (
    <Form.Group controlId={`files.${itemIndex}.description`} as={Row}>
      <Form.Group.Label column lg={2}>
        {t('uploadedFilesList.fields.description.label')}
      </Form.Group.Label>
      <Col lg={10}>
        <Controller
          name={`files.${itemIndex}.description`}
          control={control}
          rules={descriptionRules}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <>
              <Form.Group.TextArea
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                rows={2}
                ref={ref}
              />
              <Form.Group.Feedback type="invalid">{error?.message}</Form.Group.Feedback>
            </>
          )}
        />
      </Col>
    </Form.Group>
  )
}
