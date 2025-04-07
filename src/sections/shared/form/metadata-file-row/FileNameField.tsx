import { useTranslation } from 'react-i18next'
import { Controller, FieldValues, UseControllerProps, useFormContext } from 'react-hook-form'
import { Col, Form, Row } from '@iqss/dataverse-design-system'
import { FilesListFormData } from '../../file-uploader/uploaded-files-list/UploadedFilesList'
import { FileUploaderHelper } from '../../file-uploader/FileUploaderHelper'

interface FileNameFieldProps {
  itemIndex: number
  defaultValue?: string
}

export const FileNameField = ({ itemIndex, defaultValue }: FileNameFieldProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('shared')

  const fileNameRules: UseControllerProps<FilesListFormData>['rules'] = {
    required: t('fileMetadataForm.fields.fileName.required'),
    validate: (value, formValues) => {
      const currentFile = formValues.files[itemIndex]

      if (!FileUploaderHelper.isValidFileName(value as string)) {
        return t('fileMetadataForm.fields.fileName.invalid.characters')
      }

      if (
        !FileUploaderHelper.isUniqueCombinationOfFilepathAndFilename({
          fileName: value as string,
          filePath: currentFile.fileDir,
          fileKey: currentFile.key,
          allFiles: formValues.files
        })
      ) {
        return t('fileMetadataForm.fields.fileName.invalid.duplicateCombination', {
          fileName: value
        })
      }

      return true
    },
    maxLength: {
      value: 255,
      message: t('fileMetadataForm.fields.fileName.invalid.maxLength', {
        maxLength: 255
      })
    }
  }

  return (
    <Form.Group controlId={`files.${itemIndex}.fileName`} as={Row}>
      <Form.Group.Label required={true} column lg={2}>
        {t('fileMetadataForm.fields.fileName.label')}
      </Form.Group.Label>
      <Col lg={10}>
        <Controller
          name={`files.${itemIndex}.fileName`}
          control={control}
          defaultValue={defaultValue}
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
