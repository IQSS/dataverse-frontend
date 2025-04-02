import { Link } from 'react-router-dom'
import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FilePreview } from '../../../../../../files/domain/models/FilePreview'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { FileSelection } from '../../row-selection/useFileSelection'
import { NoSelectedFilesModal } from '../no-selected-files-modal/NoSelectedFilesModal'
import { useNotImplementedModal } from '../../../../../not-implemented/NotImplementedModalContext'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DatasetRestrictFileButton } from '@/sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/DatasetRestrictFileButton'
import { DatasetDeleteFileButton } from '@/sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/DatasetDeleteFileButton'
import { RouteWithParams } from '@/sections/Route.enum'
import { ReplaceFileReferrer } from '@/sections/replace-file/ReplaceFile'

type EditFilesOptionsProps =
  | {
      files: FilePreview[]
      file?: never
      fileSelection: FileSelection
      fileRepository: FileRepository
      datasetInfo?: never
      isHeader: true
    }
  | {
      files?: never
      file: FilePreview
      fileSelection?: never
      fileRepository: FileRepository
      datasetInfo: EditFilesMenuDatasetInfo
      isHeader: false
    }

export interface EditFilesMenuDatasetInfo {
  persistentId: string
  versionNumber: string
  releasedVersionExists: boolean
  termsOfAccessForRestrictedFiles?: string
}

const SELECTED_FILES_EMPTY = 0
export function EditFilesOptions({
  file,
  files,
  fileSelection,
  fileRepository,
  datasetInfo,
  isHeader
}: EditFilesOptionsProps) {
  const { t } = useTranslation('files')
  const { t: tFile } = useTranslation('file')
  const [showNoFilesSelectedModal, setShowNoFilesSelectedModal] = useState(false)
  const settingsEmbargoAllowed = false // TODO - Ask Guillermo if this is included in the settings endpoint
  const provenanceEnabledByConfig = false // TODO - Ask Guillermo if this is included in the MVP and from which endpoint is coming from
  const { showModal } = useNotImplementedModal()

  if (!isHeader) {
    return (
      <>
        <DatasetRestrictFileButton
          fileId={file.id}
          isRestricted={file.access.restricted}
          fileRepository={fileRepository}
          datasetInfo={datasetInfo}
        />

        <DropdownButtonItem
          as={Link}
          to={RouteWithParams.FILES_REPLACE(
            datasetInfo.persistentId,
            datasetInfo.versionNumber,
            file.id,
            ReplaceFileReferrer.DATASET
          )}>
          {tFile('actionButtons.editFileMenu.options.replace')}
        </DropdownButtonItem>

        <DatasetDeleteFileButton
          fileId={file.id}
          fileRepository={fileRepository}
          datasetInfo={datasetInfo}
        />
      </>
    )
  }

  const onClick = () => {
    if (Object.keys(fileSelection).length === SELECTED_FILES_EMPTY) {
      setShowNoFilesSelectedModal(true)
    } else {
      // TODO - Implement edit files
      showModal()
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
