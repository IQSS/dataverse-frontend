import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { RouteWithParams } from '@/sections/Route.enum'
import { DeleteFileButton } from './delete-file-button/DeleteFileButton'
import { RestrictFileButton } from './restrict-file-button/RestrictFileButton'

interface EditFileMenuProps {
  fileId: number
  fileRepository: FileRepository
  isRestricted: boolean
  datasetInfo: EditFileMenuDatasetInfo
}

export interface EditFileMenuDatasetInfo {
  persistentId: string
  versionNumber: string
  releasedVersionExists: boolean
  requestAccess?: boolean
  termsOfAccessForRestrictedFiles?: string
}

export const EditFileMenu = ({
  fileId,
  fileRepository,
  datasetInfo,
  isRestricted
}: EditFileMenuProps) => {
  const { t } = useTranslation('file')
  const navigate = useNavigate()

  const handleOnReplaceClick = () =>
    navigate(
      RouteWithParams.FILES_REPLACE(datasetInfo.persistentId, datasetInfo.versionNumber, fileId)
    )
  const handleOnMetadataClick = () =>
    navigate(
      RouteWithParams.EDIT_FILE_METADATA(
        datasetInfo.persistentId,
        datasetInfo.versionNumber,
        fileId
      )
    )
  return (
    <DropdownButton
      id="edit-files-menu"
      title={t('actionButtons.editFileMenu.title')}
      asButtonGroup
      variant="secondary">
      <DropdownButtonItem onClick={handleOnMetadataClick}>
        {t('actionButtons.editFileMenu.options.metadata')}
      </DropdownButtonItem>
      <RestrictFileButton
        fileId={fileId}
        isRestricted={isRestricted}
        fileRepository={fileRepository}
        datasetInfo={datasetInfo}
      />
      <DropdownButtonItem onClick={handleOnReplaceClick}>
        {t('actionButtons.editFileMenu.options.replace')}
      </DropdownButtonItem>
      <DeleteFileButton fileId={fileId} fileRepository={fileRepository} datasetInfo={datasetInfo} />
    </DropdownButton>
  )
}
