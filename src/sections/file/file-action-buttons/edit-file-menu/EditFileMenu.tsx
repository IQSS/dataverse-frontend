import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { DropdownButton, DropdownButtonItem } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { RouteWithParams } from '@/sections/Route.enum'
import { DeleteFileButton } from './delete-file-button/DeleteFileButton'

interface EditFileMenuProps {
  fileId: number
  fileRepository: FileRepository
  datasetInfo: EditFileMenuDatasetInfo
}

export interface EditFileMenuDatasetInfo {
  persistentId: string
  versionNumber: string
  releasedVersionExists: boolean
}

export const EditFileMenu = ({ fileId, fileRepository, datasetInfo }: EditFileMenuProps) => {
  const { t } = useTranslation('file')
  const navigate = useNavigate()

  const handleOnReplaceClick = () =>
    navigate(
      RouteWithParams.FILES_REPLACE(datasetInfo.persistentId, datasetInfo.versionNumber, fileId)
    )

  return (
    <DropdownButton
      id="edit-files-menu"
      title={t('actionButtons.editFileMenu.title')}
      asButtonGroup
      variant="secondary">
      {/* 👇 These buttons are commented out but I keep them because they are the next thing to be developed.*/}
      {/* <DropdownButtonItem>{t('actionButtons.editFileMenu.options.metadata')}</DropdownButtonItem>
      <DropdownButtonItem>{t('actionButtons.editFileMenu.options.restrict')}</DropdownButtonItem>
       */}
      <DropdownButtonItem onClick={handleOnReplaceClick}>
        {t('actionButtons.editFileMenu.options.replace')}
      </DropdownButtonItem>
      <DeleteFileButton fileId={fileId} fileRepository={fileRepository} datasetInfo={datasetInfo} />
    </DropdownButton>
  )
}
