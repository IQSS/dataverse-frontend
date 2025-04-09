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
}

export const EditFileMetadataRow = ({ file, itemIndex }: EditFileMetadataRowProps) => {
  const { register } = useFormContext()
  const iconName = FileTypeToFileIconMap[file.fileType] || /* istanbul ignore next */ IconName.OTHER
  return (
    <tr>
      <td colSpan={2}>
        <div className={styles.icon_fields_wrapper}>
          <div className={styles.icon}>
            <Icon name={iconName} />
          </div>
          <div className={styles.form_fields}>
            <input type="hidden" {...register(`files.${itemIndex}.id`)} defaultValue={file.id} />
            <FileNameField itemIndex={itemIndex} defaultValue={file.fileName} />
            <FilePathField itemIndex={itemIndex} defaultValue={file.fileDir} />
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
