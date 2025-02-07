import { useTranslation } from 'react-i18next'
import { DropdownButton } from '@iqss/dataverse-design-system'
import { DeleteFileButton } from './delete-file-button/DeleteFileButton'

export const EditFileMenu = () => {
  const { t } = useTranslation('file')

  return (
    <DropdownButton
      id="edit-files-menu"
      title={t('actionButtons.editFileMenu.title')}
      asButtonGroup
      variant="secondary">
      {/* 👇 These buttons are commented out but I keep them because they are the next thing to be developed.*/}
      {/* <DropdownButtonItem>{t('actionButtons.editFileMenu.options.metadata')}</DropdownButtonItem>
      <DropdownButtonItem>{t('actionButtons.editFileMenu.options.restrict')}</DropdownButtonItem>
      <DropdownButtonItem>{t('actionButtons.editFileMenu.options.replace')}</DropdownButtonItem> */}

      <DeleteFileButton />
    </DropdownButton>
  )
}
