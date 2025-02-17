import { useTranslation } from 'react-i18next'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DeleteFileButton } from './delete-file-button/DeleteFileButton'

interface EditFileDropdownProps {
  fileId: number
  fileRepository: FileRepository
  datasetInfo: EditFileDropdownDatasetInfo
}

export interface EditFileDropdownDatasetInfo {
  persistentId: string
  isDraft: boolean
  releasedVersionExists: boolean
}

export const EditFileDropdown = ({
  fileId,
  fileRepository,
  datasetInfo
}: EditFileDropdownProps) => {
  const { t } = useTranslation('file')

  // TODO:ME - Add unit tests.

  return (
    <DropdownButton
      id="edit-files-menu"
      title={t('actionButtons.editFileDropdown.title')}
      asButtonGroup
      variant="secondary">
      {/* 👇 These buttons are commented out but I keep them because they are the next thing to be developed.*/}
      {/* <DropdownButtonItem>{t('actionButtons.editFileDropdown.options.metadata')}</DropdownButtonItem>
      <DropdownButtonItem>{t('actionButtons.editFileDropdown.options.restrict')}</DropdownButtonItem>
      <DropdownButtonItem>{t('actionButtons.editFileDropdown.options.replace')}</DropdownButtonItem> */}

      <DeleteFileButton fileId={fileId} fileRepository={fileRepository} datasetInfo={datasetInfo} />
    </DropdownButton>
  )
}
