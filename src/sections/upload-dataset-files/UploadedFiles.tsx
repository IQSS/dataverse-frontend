import {
  Button,
  Card,
  Form
} from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { X } from 'react-bootstrap-icons'
import { FileUploadState } from '../../files/domain/models/FileUploadState'
import styles from './FileUploader.module.scss'
import { FormEvent, useState, MouseEvent } from 'react'
import { FileForm } from './uploaded-files-list/file-form/FileForm'
import { TagOptions } from './uploaded-files-list/tag-options/TagOptions'
import { FilesHeader } from './uploaded-files-list/files-header/FilesHeader'

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
  const [tags, setTagOptions] = useState(['Documentation', 'Data', 'Code'])
  const ignoreClasses = new Set<string>([
    'form-control',
    'btn',
    'form-check-input',
    'form-check-label',
    'dropdown-item',
    'dropdown'
  ])
  const updateFileRestricted = (file: FileUploadState, updated: boolean) => {
    file.restricted = updated
    // TODO: show dialog for restriction
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
    if (!classList.some((x) => ignoreClasses.has(x))) {
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
    <>
      <TagOptions tags={tags} setTagOptions={setTagOptions} />
      <div hidden={fileUploadState.length === 0}>
        <Card>
          <FilesHeader fileUploadState={fileUploadState} saveDisabled={saveDisabled} updateFiles={updateFiles} cleanup={cleanup} addFiles={addFiles} selected={selected} setSelected={setSelected}/>
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
                      <FileForm file={file} updateFiles={updateFiles} tags={tags} />
                      <div className={styles.file_size}>{file.fileSizeString}</div>
                      <div>
                        <Form.Group.Checkbox
                          label="Restricted"
                          id={'restricted-' + file.key}
                          checked={file.restricted}
                          onChange={(event: FormEvent<HTMLInputElement>) =>
                            updateFileRestricted(file, event.currentTarget.checked)
                          }
                        />
                      </div>
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
    </>
  )
}
