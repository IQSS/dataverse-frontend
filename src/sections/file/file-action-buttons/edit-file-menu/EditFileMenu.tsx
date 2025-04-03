import { useTranslation } from 'react-i18next'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
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
  releasedVersionExists: boolean
  termsOfAccessForRestrictedFiles?: string
}

export const EditFileMenu = ({
  fileId,
  fileRepository,
  datasetInfo,
  isRestricted
}: EditFileMenuProps) => {
  const { t } = useTranslation('file')

  return (
    <DropdownButton
      id="edit-files-menu"
      title={t('actionButtons.editFileMenu.title')}
      asButtonGroup
      variant="secondary">
      {/* 👇 These buttons are commented out but I keep them because they are the next thing to be developed.*/}
      {/* <DropdownButtonItem>{t('actionButtons.editFileMenu.options.metadata')}</DropdownButtonItem>
      <DropdownButtonItem>{t('actionButtons.editFileMenu.options.replace')}</DropdownButtonItem> */}
      <RestrictFileButton
        fileId={fileId}
        isRestricted={isRestricted}
        fileRepository={fileRepository}
        datasetInfo={datasetInfo}
      />
      <DeleteFileButton fileId={fileId} fileRepository={fileRepository} datasetInfo={datasetInfo} />
    </DropdownButton>
  )
}
