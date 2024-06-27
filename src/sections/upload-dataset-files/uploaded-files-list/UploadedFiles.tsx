import { Button, Card, Form } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { X } from 'react-bootstrap-icons'
import { FileUploadState } from '../../../files/domain/models/FileUploadState'
import styles from '../FileUploader.module.scss'
import { FormEvent, useState, MouseEvent } from 'react'
import { FileForm } from './file-form/FileForm'
import { TagOptionsModal } from './tag-options-modal/TagOptionsModal'
import { FilesHeader } from './files-header/FilesHeader'
import { RestrictionModal, RestrictionModalResult } from './restriction-modal/RestrictionModal'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation('uploadDatasetFiles')
  const [selected, setSelected] = useState(new Set<FileUploadState>())
  const [filesToRestrict, setFilesToRestrict] = useState<FileUploadState[]>([])
  const [tags, setTagOptions] = useState([t('tags.documentation'), t('tags.data'), t('tags.code')])
  const [terms, setTerms] = useState('')
  const [requestAccess, setRequestAccess] = useState(true)
  const [showRestrictionModal, setShowRestrictionModal] = useState(false)
  const [showTagOptionsModal, setShowTagOptionsModal] = useState(false)
  const ignoreClasses = new Set<string>([
    'form-control',
    'btn',
    'form-check-input',
    'form-check-label',
    'dropdown-item',
    'dropdown'
  ])
  const updateFilesRestricted = (files: FileUploadState[], restricted: boolean) => {
    if (restricted) {
      setFilesToRestrict(files)
      setShowRestrictionModal(true)
    } else {
      files.forEach((file) => (file.restricted = false))
      updateFiles(files)
    }
  }
  const restrict = (res: RestrictionModalResult) => {
    if (res.saved) {
      setTerms(res.terms)
      setRequestAccess(res.requestAccess)
      filesToRestrict.forEach((file) => (file.restricted = true))
      updateFiles(filesToRestrict)
    }
    setShowRestrictionModal(false)
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
      updateSelected(file)
    }
  }
  const updateSelected = (file: FileUploadState) => {
    setSelected((current) => {
      if (current.has(file)) {
        current.delete(file)
      } else {
        current.add(file)
      }
      return new Set<FileUploadState>(current)
    })
  }

  return (
    <>
      <div className={styles.forms}>
        <TagOptionsModal
          tags={tags}
          setTagOptions={setTagOptions}
          show={showTagOptionsModal}
          hide={() => setShowTagOptionsModal(false)}
        />
        <RestrictionModal
          defaultRequestAccess={requestAccess}
          defaultTerms={terms}
          show={showRestrictionModal}
          update={restrict}
        />
      </div>
      <div hidden={fileUploadState.length === 0}>
        <Card>
          <FilesHeader
            fileUploadState={fileUploadState}
            saveDisabled={saveDisabled}
            updateFiles={updateFiles}
            cleanup={cleanup}
            addFiles={addFiles}
            selected={selected}
            setSelected={setSelected}
            updateFilesRestricted={updateFilesRestricted}
          />
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
                      <div className={styles.selected_files_cb}>
                        <Form.Group.Checkbox
                          label={''}
                          id={'select-all'}
                          checked={selected.has(file)}
                          onChange={(event) => updateSelected(file)}
                        />
                      </div>
                      <FileForm
                        file={file}
                        updateFiles={updateFiles}
                        tags={tags}
                        editTagOptions={() => setShowTagOptionsModal(true)}
                      />
                      <div className={styles.file_size} title={t('uploadedFileSize')}>
                        {file.fileSizeString}
                      </div>
                      <div>
                        <Form.Group.Checkbox
                          label={t('restricted')}
                          id={'restricted-' + file.key}
                          checked={file.restricted}
                          onChange={(event: FormEvent<HTMLInputElement>) =>
                            updateFilesRestricted([file], event.currentTarget.checked)
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
