import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { File } from '../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FileSelection } from '../../row-selection/useFileSelection'
import { NoSelectedFilesModal } from '../no-selected-files-modal/NoSelectedFilesModal'

interface EditFileOptionsProps {
  files: File[]
  fileSelection: FileSelection
}
const SELECTED_FILES_EMPTY = 0
export function EditFilesOptions({ files, fileSelection }: EditFileOptionsProps) {
  const { t } = useTranslation('files')
  const [showNoFilesSelectedModal, setShowNoFilesSelectedModal] = useState(false)
  const settingsEmbargoAllowed = false // TODO - Ask Guillermo if this is included in the settings endpoint
  const provenanceEnabledByConfig = false // TODO - Ask Guillermo if this is included in the MVP and from which endpoint is coming from

  const onClick = () => {
    if (Object.keys(fileSelection).length === SELECTED_FILES_EMPTY) {
      setShowNoFilesSelectedModal(true)
    }
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
