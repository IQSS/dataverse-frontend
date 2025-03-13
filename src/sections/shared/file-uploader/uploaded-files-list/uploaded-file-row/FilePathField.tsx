import { useTranslation } from 'react-i18next'
import { Controller, FieldValues, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { FilesListFormData } from '../UploadedFilesList'
import { UploadedFilesListHelper } from '../UploadedFilesListHelper'

interface FilePathFieldProps {
  itemIndex: number
}

export const FilePathField = ({ itemIndex }: FilePathFieldProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('shared')

  const filePathRules: UseControllerProps<FilesListFormData>['rules'] = {
    validate: (value, formValues) => {
      const currentFile = formValues.files[itemIndex]

      if (!UploadedFilesListHelper.isValidFilePath(value as string)) {
        return t('fileUploader.uploadedFilesList.fields.filePath.invalid.characters')
      }

      if (
        !UploadedFilesListHelper.isUniqueCombinationOfFilepathAndFilename({
          fileName: currentFile.fileName,
          filePath: value as string,
          fileKey: currentFile.key,
          allFiles: formValues.files
        })
      ) {
        return t('fileUploader.uploadedFilesList.fields.filePath.invalid.duplicateCombination', {
          fileName: value
        })
      }

      return true
    },
    maxLength: {
      value: 255,
      message: t('fileUploader.uploadedFilesList.fields.filePath.invalid.maxLength', {
        maxLength: 255
      })
    }
  }

  return (
    <Form.Group controlId={`files.${itemIndex}.fileDir`} as={Row}>
      <Form.Group.Label
        message={t('fileUploader.uploadedFilesList.fields.filePath.description')}
        column
        lg={2}>
        {t('fileUploader.uploadedFilesList.fields.filePath.label')}
      </Form.Group.Label>
      <Col lg={10}>
        <Controller
          name={`files.${itemIndex}.fileDir`}
          control={control}
          rules={filePathRules as FieldValues}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <>
              <Form.Group.Input
                type="text"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
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
