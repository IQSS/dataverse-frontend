import { useTranslation } from 'react-i18next'
import { CloseButton, Icon, IconName } from '@iqss/dataverse-design-system'
import { InfoCircleFill } from 'react-bootstrap-icons'
import MimeTypeDisplay from '@/files/domain/models/FileTypeToFriendlyTypeMap'
import { FileTypeToFileIconMap } from '@/sections/file/file-preview/FileTypeToFileIconMap'
import { RowSelectionCheckbox } from '@/sections/shared/form/row-selection-checkbox/RowSelectionCheckbox'
import { UploadedFile } from '../../context/fileUploaderReducer'
import { FileNameField } from './FileNameField'
import { FilePathField } from './FilePathField'
import { FileDescriptionField } from './FileDescriptionField'
import styles from './UploadedFileRow.module.scss'

interface UploadedFileRowProps {
  file: UploadedFile
  isSelected: boolean
  itemIndex: number
  handleSelectFile: (fileKey: string) => void
  handleRemoveFile: (fileIndex: number, fileKey: string) => void
  isSaving: boolean
}

export const UploadedFileRow = ({
  file,
  isSelected,
  handleSelectFile,
  handleRemoveFile,
  itemIndex,
  isSaving
}: UploadedFileRowProps) => {
  const { t } = useTranslation('shared')

  const iconName = FileTypeToFileIconMap[file.fileType] || /* istanbul ignore next */ IconName.OTHER

  return (
    <tr>
      <th colSpan={1}>
        <RowSelectionCheckbox checked={isSelected} onChange={() => handleSelectFile(file.key)} />
      </th>
      <td colSpan={2}>
        <div className={styles.icon_fields_wrapper}>
          <div className={styles.icon}>
            <Icon name={iconName} />
          </div>
          <div className={styles.form_fields}>
            {/* File Name field */}
            <FileNameField itemIndex={itemIndex} />

            {/* File Path field */}
            <FilePathField itemIndex={itemIndex} />

            {/* Description field */}
            <FileDescriptionField itemIndex={itemIndex} />

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
              onClick={() => {
                handleRemoveFile(itemIndex, file.key)
              }}
              aria-label={t('fileUploader.uploadedFilesList.removeFile')}
              disabled={isSaving}
            />
          </div>
        </div>
      </td>
    </tr>
  )
}
