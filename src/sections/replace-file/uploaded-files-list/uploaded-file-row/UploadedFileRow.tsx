import { useTranslation } from 'react-i18next'
import { Controller, UseControllerProps, useFormContext } from 'react-hook-form'
import { CloseButton, Col, Form, Icon, IconName, Row } from '@iqss/dataverse-design-system'
import { InfoCircleFill } from 'react-bootstrap-icons'
import MimeTypeDisplay from '@/files/domain/models/FileTypeToFriendlyTypeMap'
import { FileTypeToFileIconMap } from '@/sections/file/file-preview/FileTypeToFileIconMap'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import { UploadedFileInfo } from '../UploadedFileInfo'
import { UploadedFilesListHelper } from '../UploadedFilesListHelper'
import styles from './UploadedFileRow.module.scss'

interface UploadedFileRowProps {
  file: UploadedFileInfo
  isSelected: boolean
  itemIndex: number
  handleSelectFile: (file: UploadedFileInfo) => void
  handleRemoveFile: (fileKey: string) => void
}

export const UploadedFileRow = ({
  file,
  isSelected,
  handleSelectFile,
  handleRemoveFile,
  itemIndex
}: UploadedFileRowProps) => {
  const { control } = useFormContext()
  const { t } = useTranslation('shared')

  const iconName = FileTypeToFileIconMap[file.fileType] || IconName.OTHER

  const fileNameRules: UseControllerProps['rules'] = {
    required: t('uploadedFilesList.fields.fileName.required'),
    validate: (value: string) => {
      if (!UploadedFilesListHelper.isValidFileName(value)) {
        return t('uploadedFilesList.fields.fileName.invalid.characters')
      }
      return true
    },
    maxLength: {
      value: 255,
      message: t('uploadedFilesList.fields.fileName.invalid.maxLength', { maxLength: 255 })
    }
  }

  const filePathRules: UseControllerProps['rules'] = {
    validate: (value: string) => {
      if (!UploadedFilesListHelper.isValidFilePath(value)) {
        return t('uploadedFilesList.fields.filePath.invalid.characters')
      }
      return true
    },
    maxLength: {
      value: 255,
      message: t('uploadedFilesList.fields.filePath.invalid.maxLength', { maxLength: 255 })
    }
  }

  const descriptionRules: UseControllerProps['rules'] = {
    maxLength: {
      value: 255,
      message: t('uploadedFilesList.fields.description.invalid.maxLength', { maxLength: 255 })
    }
  }

  return (
    <tr>
      <th colSpan={1}>
        <RowSelectionCheckbox checked={isSelected} onChange={() => handleSelectFile(file)} />
      </th>
      <td colSpan={2}>
        <div className={styles.icon_fields_wrapper}>
          <div className={styles.icon}>
            <Icon name={iconName} />
          </div>
          <div className={styles.form_fields}>
            {/* File Name field */}
            <Form.Group controlId={`files.${itemIndex}.fileName`} as={Row}>
              <Form.Group.Label required={true} column lg={2}>
                {t('uploadedFilesList.fields.fileName.label')}
              </Form.Group.Label>
              <Col lg={10}>
                <Controller
                  name={`files.${itemIndex}.fileName`}
                  control={control}
                  rules={fileNameRules}
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

            {/* File Path field */}
            <Form.Group controlId={`files.${itemIndex}.fileDir`} as={Row}>
              <Form.Group.Label
                message={t('uploadedFilesList.fields.filePath.description')}
                column
                lg={2}>
                {t('uploadedFilesList.fields.filePath.label')}
              </Form.Group.Label>
              <Col lg={10}>
                <Controller
                  name={`files.${itemIndex}.fileDir`}
                  control={control}
                  rules={filePathRules}
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

            {/* Description field */}
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

            <div className={styles.file_extra_info}>
              <InfoCircleFill />
              <span>{file.fileSizeString}</span>-<span>{MimeTypeDisplay[file.fileType]}</span>-
              <span>
                <i>{file.checksumAlgorithm}:</i> {file.checksumValue}
              </span>
            </div>
          </div>
          <div>
            <CloseButton
              type="button"
              className={styles.remove_button}
              onClick={() => handleRemoveFile(file.key)}
              aria-label={t('uploadedFilesList.removeFile')}
            />
          </div>
        </div>
      </td>
    </tr>
  )
}
