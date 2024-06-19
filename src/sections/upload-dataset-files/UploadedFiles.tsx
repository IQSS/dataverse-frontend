import {
  Button,
  Card,
  Col,
  DropdownButton,
  DropdownButtonItem,
  Form
} from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { PencilFill, Plus, X } from 'react-bootstrap-icons'
import { FileUploadState } from '../../files/domain/models/FileUploadState'
import styles from './FileUploader.module.scss'
import { FormEvent, useState, MouseEvent } from 'react'

interface DatasetFilesProps {
  fileUploadState: FileUploadState[]
  cancelTitle: string
  saveDisabled: boolean
  updateFiles: (file: FileUploadState[]) => void
  cleanup: () => void
  addFiles: (fileUploadState: FileUploadState[]) => void
}

export function UploadedFiles({
  fileUploadState,
  cancelTitle,
  saveDisabled,
  updateFiles,
  cleanup,
  addFiles
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
    updateFiles([file])
  }
  const updateFileDir = (file: FileUploadState, updated: string) => {
    file.fileDir = updated
    updateFiles([file])
  }
  const updateFileDescription = (file: FileUploadState, updated: string) => {
    file.description = updated
    updateFiles([file])
  }
  const updateFileRestricted = (file: FileUploadState, updated: boolean) => {
    file.restricted = updated
    // TODO: show dialog for restriction
    updateFiles([file])
  }
  const addTag = (file: FileUploadState) => {
    // TODO: show dialog for tag
    updateFiles([file])
  }
  const deleteFile = (file: FileUploadState) => {
    file.removed = true
    setSelected((x) => {
      x.delete(file)
      return x
    })
    updateFiles([file])
  }
  const clicked = (event: MouseEvent<HTMLDivElement, unknown>, file: FileUploadState) => {
    const classList = Array.from((event.target as HTMLDivElement).classList)
    const parent = (event.target as HTMLDivElement).parentElement
    if (parent) {
      classList.push(...Array.from(parent.classList))
      if (parent.parentElement) {
        classList.push(...Array.from(parent.parentElement.classList))
      }
    }
    console.log(classList)
    if (!classList.some((x) => x === 'form-control' || x === 'btn' || x === 'form-check-input')) {
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
  const all = () => {
    setSelected((current) => {
      if (current.size === fileUploadState.length) {
        return new Set<FileUploadState>()
      } else {
        return new Set<FileUploadState>(fileUploadState)
      }
    })
  }
  const restrictSelected = () => {
    // TODO: show dialog for restriction
    const res = Array.from(selected).map((x) => {
      x.restricted = true
      return x
    })
    updateFiles(res)
  }
  const unrestrictSelected = () => {
    const res = Array.from(selected).map((x) => {
      x.restricted = false
      return x
    })
    updateFiles(res)
  }
  const deleteSelected = () => {
    const res = Array.from(selected).map((x) => {
      x.removed = true
      return x
    })
    setSelected(new Set<FileUploadState>())
    updateFiles(res)
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
          <Button withSpacing variant="link" onClick={all} disabled={saving}>
            {' '}
            {fileUploadState.length}
            {fileUploadState.length === 1 ? ' file uploaded' : ' files uploaded'}
          </Button>
          <span className={styles.selected} hidden={selected.size === 0}>
            <span>
              {selected.size}
              {selected.size === 1 ? ' file selected' : ' files selected'}
            </span>
            <DropdownButton
              variant="secondary"
              withSpacing
              icon={<PencilFill className={styles.icon_pencil} />}
              id={'edit-files'}
              title={'Edit files'}>
              <DropdownButtonItem onClick={restrictSelected}>{'Restrict'}</DropdownButtonItem>
              <DropdownButtonItem onClick={unrestrictSelected}>{'Unrestrict'}</DropdownButtonItem>
              <DropdownButtonItem onClick={deleteSelected}>{'Delete'}</DropdownButtonItem>
            </DropdownButton>
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
                              checked={file.restricted}
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
