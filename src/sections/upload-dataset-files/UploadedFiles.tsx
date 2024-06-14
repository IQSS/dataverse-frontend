import { Button } from '@iqss/dataverse-design-system'
import { X } from 'react-bootstrap-icons'
import { info } from 'sass'
import { FileUploadState } from '../../files/domain/models/FileUploadState'
import styles from './FileUploader.module.scss'

interface DatasetFilesProps {
  fileUploadState: FileUploadState[]
  cancelTitle: string
  deleteFile: (file: FileUploadState) => void
}

export function UploadedFiles({ fileUploadState, cancelTitle, deleteFile }: DatasetFilesProps) {
  return (
    <>
      {fileUploadState && fileUploadState.filter((x) => x.done).length > 0 ? (
        <div className={styles.files}>
          {fileUploadState.map((file) => (
            <div className={styles.file} key={file.key}>
              <div className={styles.file_name}>
                {file.fileDir}
                {file.fileName}
              </div>
              <div className={styles.file_size}>{file.fileSizeString}</div>
              <div className={styles.upload_progress}>{null}</div>
              <div className={styles.cancel_upload}>
                <Button
                  variant="secondary"
                  {...{ size: 'sm' }}
                  withSpacing
                  onClick={() => deleteFile(file)}>
                  <X className={styles.icon} title={cancelTitle} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.info}>{info}</div>
      )}
    </>
  )
}
