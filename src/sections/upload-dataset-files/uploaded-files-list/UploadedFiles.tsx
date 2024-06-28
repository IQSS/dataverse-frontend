import { Button, Card, Form } from '@iqss/dataverse-design-system'
import cn from 'classnames'
import { X } from 'react-bootstrap-icons'
import { FileUploadState } from '../../../files/domain/models/FileUploadState'
import styles from '../FileUploader.module.scss'
import { FormEvent, useState } from 'react'
import { FileForm } from './file-form/FileForm'
import { TagOptionsModal } from './tag-options-modal/TagOptionsModal'
import { FilesHeader } from './files-header/FilesHeader'
import { RestrictionModal, RestrictionModalResult } from './restriction-modal/RestrictionModal'
import { useTranslation } from 'react-i18next'
import { AddTagsModal, AddTagsModalResult } from './add-tags-modal/AddTagsModal'

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
  const [tagOptions, setTagOptions] = useState([
    t('tags.documentation'),
    t('tags.data'),
    t('tags.code')
  ])
  const [terms, setTerms] = useState('')
  const [requestAccess, setRequestAccess] = useState(true)
  const [showRestrictionModal, setShowRestrictionModal] = useState(false)
  const [showTagOptionsModal, setShowTagOptionsModal] = useState(false)
  const [showAddTagsModal, setShowAddTagsModal] = useState(false)
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
  const addTags = (res: AddTagsModalResult) => {
    if (res.saved) {
      const filesToAddTagsTo = Array.from(selected).map((file) => {
        const newTags = [...file.tags]
        res.tags.forEach((t) => {
          if (!file.tags.some((x) => x === t)) newTags.push(t)
        })
        file.tags = newTags
        return file
      })
      console.log(filesToAddTagsTo)
      updateFiles(filesToAddTagsTo)
    }
    setShowAddTagsModal(false)
  }
  const deleteFile = (file: FileUploadState) => {
    file.removed = true
    setSelected((x) => {
      x.delete(file)
      return x
    })
    updateFiles([file])
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
  const save = () => {
    addFiles(fileUploadState)
    cleanup()
  }

  return (
    <>
      <div className={styles.forms}>
        <TagOptionsModal
          availableTags={[...tagOptions]}
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
        <AddTagsModal
          show={showAddTagsModal}
          availableTags={[...tagOptions]}
          setTagOptions={setTagOptions}
          update={addTags}
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
            showAddTagsModal={() => setShowAddTagsModal(true)}
          />
          <Card.Body>
            <div>
              {fileUploadState.length > 0 ? (
                <div className={styles.uploaded_files}>
                  {fileUploadState.map((file) => (
                    <div
                      className={cn(styles.file, {
                        [styles.selected_file]: selected.has(file)
                      })}
                      key={file.key}>
                      <div className={styles.selected_files_cb}>
                        <Form.Group.Checkbox
                          label={''}
                          id={'select-all'}
                          checked={selected.has(file)}
                          onChange={() => updateSelected(file)}
                        />
                      </div>
                      <FileForm
                        file={file}
                        updateFiles={updateFiles}
                        availableTags={[...tagOptions]}
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
            <div className={styles.save_btn}>
              <Button withSpacing onClick={save} disabled={saveDisabled} title={t('saveUploaded')}>
                {t('save')}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </div>
    </>
  )
}
