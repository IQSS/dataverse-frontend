import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'

interface FileDescriptionFieldProps {
  itemIndex: number
  defaultValue?: string
}
/**
 * FileDescriptionField component
 * This field is meant to be used within a form that is using react-hook-form.
 * It is a controlled component that uses the Controller from react-hook-form to manage its state.
 * It is shared between the EditFileMetadata and FileUploader components.
 */
export const FileDescriptionField = ({ itemIndex, defaultValue }: FileDescriptionFieldProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('shared')

  const descriptionRules: UseControllerProps['rules'] = {
    maxLength: {
      value: 255,
      message: t('fileMetadataForm.fields.description.invalid.maxLength', {
        maxLength: 255
      })
    }
  }

  return (
    <Form.Group controlId={`files.${itemIndex}.description`} as={Row}>
      <Form.Group.Label column lg={2}>
        {t('fileMetadataForm.fields.description.label')}
      </Form.Group.Label>
      <Col lg={10}>
        <Controller
          name={`files.${itemIndex}.description`}
          control={control}
          defaultValue={defaultValue}
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
