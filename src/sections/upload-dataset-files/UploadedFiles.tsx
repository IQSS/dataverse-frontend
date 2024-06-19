import { Button, Card, Col, Form } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { Plus, X } from 'react-bootstrap-icons'
import { FileUploadState } from '../../files/domain/models/FileUploadState'
import styles from './FileUploader.module.scss'
import { FormEvent, useState, MouseEvent } from 'react'

interface DatasetFilesProps {
  fileUploadState: FileUploadState[]
  cancelTitle: string
  saveDisabled: boolean
  deleteFile: (file: FileUploadState) => void
  cleanup: () => void
  addFiles: (fileUploadState: FileUploadState[]) => void
  updateFile: (file: FileUploadState) => void
}

export function UploadedFiles({
  fileUploadState,
  cancelTitle,
  saveDisabled,
  deleteFile,
  cleanup,
  addFiles,
  updateFile
}: DatasetFilesProps) {
  const [selected, setSelected] = useState(new Set<FileUploadState>())
  const [saving, setSaving] = useState(false)
  const save = () => {
    setSaving(true)
    addFiles(fileUploadState)
    cleanup()
    setSaving(false)
  }
  const updateFileName = (file: FileUploadState, updated: string) => {
    file.fileName = updated
    updateFile(file)
  }
  const updateFileDir = (file: FileUploadState, updated: string) => {
    file.fileDir = updated
    updateFile(file)
  }
  const updateFileDescription = (file: FileUploadState, updated: string) => {
    file.description = updated
    updateFile(file)
  }
  const updateFileRestricted = (file: FileUploadState, updated: boolean) => {
    file.restricted = updated
    // TODO: show dialog for restriction
    updateFile(file)
  }
  const addTag = (file: FileUploadState) => {
    // TODO: show dialog for tag
    updateFile(file)
  }
  const clicked = (event: MouseEvent<HTMLDivElement, unknown>, file: FileUploadState) => {
    const classList = (event.target as HTMLDivElement).classList
    if (
      !classList.contains('form-control') &&
      !classList.contains('btn') &&
      !classList.contains('form-check-input')
    ) {
      setSelected((current) => {
        if (current.has(file)) {
          current.delete(file)
        } else {
          current.add(file)
        }
        return new Set<FileUploadState>(current)
      })
    }
  }

  return (
    <div hidden={fileUploadState.length === 0}>
      <Card>
        <Card.Header>
          <Button withSpacing onClick={save} disabled={saveDisabled}>
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
                  <div
                    className={cn(styles.file, {
                      [styles.selected_file]: selected.has(file)
                    })}
                    key={file.key}
                    onClick={(event) => clicked(event, file)}>
                    <div className={styles.file_name}>
                      <Form>
                        <Form.Group>
                          <Form.Group.Label column sm={3}>
                            File name
                          </Form.Group.Label>
                          <Col sm={9}>
                            <Form.Group.Input
                              type="text"
                              placeholder="File name"
                              defaultValue={file.fileName}
                              onChange={(event: FormEvent<HTMLInputElement>) =>
                                updateFileName(file, event.currentTarget.value)
                              }
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group>
                          <Form.Group.Label column sm={3}>
                            File path
                          </Form.Group.Label>
                          <Col sm={9}>
                            <Form.Group.Input
                              type="text"
                              placeholder="File path"
                              defaultValue={file.fileDir}
                              onChange={(event: FormEvent<HTMLInputElement>) =>
                                updateFileDir(file, event.currentTarget.value)
                              }
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group>
                          <Form.Group.Label column sm={3}>
                            Description
                          </Form.Group.Label>
                          <Col sm={9}>
                            <Form.Group.TextArea
                              defaultValue={file.description}
                              onChange={(event: FormEvent<HTMLInputElement>) =>
                                updateFileDescription(file, event.currentTarget.value)
                              }
                            />
                          </Col>
                        </Form.Group>
                        <Form.Group>
                          <Form.Group.Label column sm={3}>
                            Restricted
                          </Form.Group.Label>
                          <Col sm={9}>
                            <Form.Group.Checkbox
                              label=""
                              id={'restricted-' + file.key}
                              defaultChecked={file.restricted}
                              onChange={(event: FormEvent<HTMLInputElement>) =>
                                updateFileRestricted(file, event.currentTarget.checked)
                              }
                            />
                          </Col>
                        </Form.Group>
                      </Form>
                      <Button
                        variant="secondary"
                        {...{ size: 'sm' }}
                        withSpacing
                        onClick={() => addTag(file)}>
                        <Plus className={styles.icon} title="Add tag" />
                        Tag
                      </Button>
                    </div>
                    <div className={styles.file_size}>{file.fileSizeString}</div>
                    <div>{null}</div>
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
