import { useTranslation } from 'react-i18next'
import { Icon, IconName } from '@iqss/dataverse-design-system'
import { useFormContext } from 'react-hook-form'
import { InfoCircleFill } from 'react-bootstrap-icons'
import MimeTypeDisplay from '@/files/domain/models/FileTypeToFriendlyTypeMap'
import { FileTypeToFileIconMap } from '@/sections/file/file-preview/FileTypeToFileIconMap'
import { FileNameField } from '@/sections/shared/form/metadata-file-row/FileNameField'
import { FilePathField } from '@/sections/shared/form/metadata-file-row/FilePathField'
import { FileDescriptionField } from '@/sections/shared/form/metadata-file-row/FileDescriptionField'
import styles from './EditFileMetadataRow.module.scss'
import { FileMetadataFormRow } from '@/sections/edit-file-metadata/EditFilesList'

interface EditFileMetadataRowProps {
  file: FileMetadataFormRow
  itemIndex: number
  isSaving: boolean
}

export const EditFileMetadataRow = ({ file, itemIndex, isSaving }: EditFileMetadataRowProps) => {
  const { t } = useTranslation('shared')
  const { register } = useFormContext()
  const iconName = FileTypeToFileIconMap[file.fileType] || /* istanbul ignore next */ IconName.OTHER
  console.log('file.id', file.id)
  console.log('description', file.description)
  return (
    <tr>
      <td colSpan={2}>
        <div className={styles.icon_fields_wrapper}>
          <div className={styles.icon}>
            <Icon name={iconName} />
          </div>
          <div className={styles.form_fields}>
            {/* Hidden input field to capture file.id */}
            <input
              type="hidden"
              {...register(`files.${itemIndex}.id`)}
              defaultValue={file.id} // Provide the initial value
            />
            <FileNameField itemIndex={itemIndex} defaultValue={file.name} />
            <FilePathField itemIndex={itemIndex} defaultValue={file.directoryLabel} />
            <FileDescriptionField itemIndex={itemIndex} defaultValue={file.description} />
            <div className={styles.file_extra_info}>
              <InfoCircleFill />
              <span>{file.fileSizeString}</span>-<span>{MimeTypeDisplay[file.fileType]}</span>-
              <span>
                <i>{file.checksumAlgorithm}:</i> {file.checksumValue}
              </span>
            </div>
          </div>
        </div>
      </td>
    </tr>
  )
}
