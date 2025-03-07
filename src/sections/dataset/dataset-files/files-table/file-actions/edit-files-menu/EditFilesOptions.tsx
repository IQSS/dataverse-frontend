import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FileSelection } from '../../row-selection/useFileSelection'
import { NoSelectedFilesModal } from '../no-selected-files-modal/NoSelectedFilesModal'
import { useNotImplementedModal } from '../../../../../not-implemented/NotImplementedModalContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { RestrictFileButton } from '@/sections/file/file-action-buttons/edit-file-menu/restrict-file-button/RestrictFileButton'
import { DeleteFileButton } from '@/sections/file/file-action-buttons/edit-file-menu/delete-file-button/DeleteFileButton'

interface EditFileOptionsProps {
  files: FilePreview[]
  fileSelection: FileSelection
  fileRepository: FileRepository
  datasetInfo: EditFilesMenuDatasetInfo
  isHeader: boolean
}

export interface EditFilesMenuDatasetInfo {
  persistentId: string
  releasedVersionExists: boolean
  termsOfAccessForRestrictedFiles?: string
}

const SELECTED_FILES_EMPTY = 0

export function EditFilesOptions({
  files,
  fileSelection,
  fileRepository,
  datasetInfo,
  isHeader
}: EditFileOptionsProps) {
  const { t } = useTranslation('files')
  const [showNoFilesSelectedModal, setShowNoFilesSelectedModal] = useState(false)
  const settingsEmbargoAllowed = false // TODO - Ask Guillermo if this is included in the settings endpoint
  const provenanceEnabledByConfig = false // TODO - Ask Guillermo if this is included in the MVP and from which endpoint is coming from
  const { showModal } = useNotImplementedModal()

  const onClick = () => {
    if (Object.keys(fileSelection).length === SELECTED_FILES_EMPTY) {
      setShowNoFilesSelectedModal(true)
    } else {
      // TODO - Implement edit files
      showModal()
    }
  }

  if (!isHeader) {
    return (
      <>
        {files.map((file) => (
          <>
            <RestrictFileButton
              key={file.id}
              fileId={file.id}
              isRestricted={file.access.restricted}
              fileRepository={fileRepository}
              datasetInfo={datasetInfo}
            />

            <DeleteFileButton
              key={file.id}
              fileId={file.id}
              fileRepository={fileRepository}
              datasetInfo={datasetInfo}
            />
          </>
        ))}
      </>
    )
  }

  return (
    <>
      <DropdownButtonItem onClick={onClick}>
        {t('actions.editFilesMenu.options.metadata')}
      </DropdownButtonItem>
      {files.some((file) => file.access.restricted) && (
        <DropdownButtonItem onClick={onClick}>
          {t('actions.editFilesMenu.options.unrestrict')}
        </DropdownButtonItem>
      )}
      {files.some((file) => !file.access.restricted) && (
        <DropdownButtonItem onClick={onClick}>
          {t('actions.editFilesMenu.options.restrict')}
        </DropdownButtonItem>
      )}
      <DropdownButtonItem onClick={onClick}>
        {t('actions.editFilesMenu.options.replace')}
      </DropdownButtonItem>
      {settingsEmbargoAllowed && (
        <DropdownButtonItem onClick={onClick}>
          {t('actions.editFilesMenu.options.embargo')}
        </DropdownButtonItem>
      )}
      {provenanceEnabledByConfig && (
        <DropdownButtonItem onClick={onClick}>
          {t('actions.editFilesMenu.options.provenance')}
        </DropdownButtonItem>
      )}
      <DropdownButtonItem onClick={onClick}>
        {t('actions.editFilesMenu.options.delete')}
      </DropdownButtonItem>
      <NoSelectedFilesModal
        show={showNoFilesSelectedModal}
        handleClose={() => setShowNoFilesSelectedModal(false)}
      />
    </>
  )
}
