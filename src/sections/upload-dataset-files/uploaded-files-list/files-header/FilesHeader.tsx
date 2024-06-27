import {
  Button,
  Card,
  DropdownButton,
  DropdownButtonItem,
  Form
} from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { FileUploadState } from '../../../../files/domain/models/FileUploadState'
import styles from './FilesHeader.module.scss'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface FilesHeaderProps {
  fileUploadState: FileUploadState[]
  selected: Set<FileUploadState>
  setSelected: Dispatch<SetStateAction<Set<FileUploadState>>>
  saveDisabled: boolean
  updateFiles: (file: FileUploadState[]) => void
  cleanup: () => void
  addFiles: (fileUploadState: FileUploadState[]) => void
  updateFilesRestricted: (fileUploadState: FileUploadState[], restricted: boolean) => void
}

export function FilesHeader({
  fileUploadState,
  selected,
  setSelected,
  saveDisabled,
  updateFiles,
  cleanup,
  addFiles,
  updateFilesRestricted
}: FilesHeaderProps) {
  const { t } = useTranslation('uploadDatasetFiles')
  const [saving, setSaving] = useState(false)
  const [selectAllChecked, setSelectAllChecked] = useState(false)
  const save = () => {
    setSaving(true)
    addFiles(fileUploadState)
    cleanup()
    setSaving(false)
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
  const updateRestriction = (restrict: boolean) => {
    updateFilesRestricted(Array.from(selected), restrict)
  }
  const deleteSelected = () => {
    const res = Array.from(selected).map((x) => {
      x.removed = true
      return x
    })
    setSelected(new Set<FileUploadState>())
    updateFiles(res)
  }

  useEffect(() => {
    setSelectAllChecked(selected.size === fileUploadState.length)
  }, [selected, fileUploadState])

  return (
    <Card.Header>
      <span className={styles.selected_files_cb}>
        <Form.Group.Checkbox
          label={''}
          id={'select-all'}
          checked={selectAllChecked}
          onChange={all}
        />
      </span>
      <Button withSpacing onClick={save} disabled={saveDisabled}>
        Save
      </Button>
      <Button withSpacing variant="secondary" onClick={cleanup} disabled={saving}>
        Cancel
      </Button>
      <span className={styles.uploaded_files_info}>
        {t('filesHeader.filesUploaded', { count: fileUploadState.length })}
      </span>
      <span className={styles.selected_files_info} hidden={selected.size === 0}>
        <span>{t('filesHeader.filesSelected', { count: selected.size })}</span>
        <DropdownButton
          variant="secondary"
          withSpacing
          icon={<PencilFill className={styles.icon_pencil} />}
          id={'edit-files'}
          title={t('filesHeader.editFiles')}>
          <DropdownButtonItem onClick={() => updateRestriction(true)}>
            {t('filesHeader.restrict')}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={() => updateRestriction(false)}>
            {t('filesHeader.unrestrict')}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={deleteSelected} title="Delete selected">
            {t('delete')}
          </DropdownButtonItem>
        </DropdownButton>
      </span>
    </Card.Header>
  )
}
