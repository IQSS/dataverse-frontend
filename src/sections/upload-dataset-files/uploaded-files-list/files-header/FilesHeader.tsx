import { Button, Card, DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { PencilFill } from 'react-bootstrap-icons'
import { FileUploadState } from '../../../../files/domain/models/FileUploadState'
import styles from './FilesHeader.module.scss'
import { Dispatch, SetStateAction, useState } from 'react'

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
  const [saving, setSaving] = useState(false)
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

  return (
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
      <span className={styles.selected_files_info} hidden={selected.size === 0}>
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
          <DropdownButtonItem onClick={() => updateRestriction(true)}>
            {'Restrict'}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={() => updateRestriction(false)}>
            {'Unrestrict'}
          </DropdownButtonItem>
          <DropdownButtonItem onClick={deleteSelected} title="Delete selected">
            {'Delete'}
          </DropdownButtonItem>
        </DropdownButton>
      </span>
    </Card.Header>
  )
}
