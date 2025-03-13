import { useTranslation } from 'react-i18next'
import { Controller, FieldValues, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { FilesListFormData } from '../UploadedFilesList'
import { UploadedFilesListHelper } from '../UploadedFilesListHelper'

interface FileNameFieldProps {
  itemIndex: number
}

export const FileNameField = ({ itemIndex }: FileNameFieldProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('shared')

  const fileNameRules: UseControllerProps<FilesListFormData>['rules'] = {
    required: t('fileUploader.uploadedFilesList.fields.fileName.required'),
    validate: (value, formValues) => {
      const currentFile = formValues.files[itemIndex]

      if (!UploadedFilesListHelper.isValidFileName(value as string)) {
        return t('fileUploader.uploadedFilesList.fields.fileName.invalid.characters')
      }

      if (
        !UploadedFilesListHelper.isUniqueCombinationOfFilepathAndFilename({
          fileName: value as string,
          filePath: currentFile.fileDir,
          fileKey: currentFile.key,
          allFiles: formValues.files
        })
      ) {
        return t('fileUploader.uploadedFilesList.fields.fileName.invalid.duplicateCombination', {
          fileName: value
        })
      }

      return true
    },
    maxLength: {
      value: 255,
      message: t('fileUploader.uploadedFilesList.fields.fileName.invalid.maxLength', {
        maxLength: 255
      })
    }
  }

  return (
    <Form.Group controlId={`files.${itemIndex}.fileName`} as={Row}>
      <Form.Group.Label required={true} column lg={2}>
        {t('fileUploader.uploadedFilesList.fields.fileName.label')}
      </Form.Group.Label>
      <Col lg={10}>
        <Controller
          name={`files.${itemIndex}.fileName`}
          control={control}
          rules={fileNameRules as FieldValues}
          render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
            <>
              <Form.Group.Input
                type="text"
                value={value as string}
                onChange={onChange}
                isInvalid={invalid}
                aria-required={true}
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
