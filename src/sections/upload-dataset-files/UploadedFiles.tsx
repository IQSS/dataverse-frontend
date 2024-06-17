import { Button, Card } from '@iqss/dataverse-design-system'
import { X } from 'react-bootstrap-icons'
import { FileUploadState } from '../../files/domain/models/FileUploadState'
import styles from './FileUploader.module.scss'
import { useState } from 'react'

interface DatasetFilesProps {
  fileUploadState: FileUploadState[]
  cancelTitle: string
  deleteFile: (file: FileUploadState) => void
  cleanup: () => void
  addFiles: (fileUploadState: FileUploadState[]) => void
}

export function UploadedFiles({
  fileUploadState,
  cancelTitle,
  deleteFile,
  cleanup,
  addFiles
}: DatasetFilesProps) {
  const [saving, setSaving] = useState(false)
  const save = () => {
    setSaving(true)
    addFiles(fileUploadState)
    cleanup()
    setSaving(false)
  }

  return (
    <div hidden={fileUploadState.length === 0}>
      <Card>
        <Card.Header>
          <Button
            withSpacing
            onClick={save}
            disabled={fileUploadState.some((x) => !(x.failed || x.done || x.removed))}>
            Save
          </Button>
          <Button withSpacing variant="secondary" onClick={cleanup} disabled={saving}>
            Cancel
          </Button>
          <span className={styles.uploaded}>
            <span>
              {fileUploadState.length}
              {fileUploadState.length === 1 ? ' file uploaded' : ' files uploaded'}
            </span>
          </span>
        </Card.Header>
        <Card.Body>
          <div>
            {fileUploadState.length > 0 ? (
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
            ) : null}
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}
