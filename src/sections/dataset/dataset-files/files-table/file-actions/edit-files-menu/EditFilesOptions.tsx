import { DropdownButtonItem } from '@iqss/dataverse-design-system'
import { File } from '../../../../../../files/domain/models/File'
import { useTranslation } from 'react-i18next'

interface EditFileOptionsProps {
  files: File[]
}
export function EditFilesOptions({ files }: EditFileOptionsProps) {
  const { t } = useTranslation('files')
  const settingsEmbargoAllowed = false // TODO - Ask Guillermo if this is included in the settings endpoint
  const provenanceEnabledByConfig = false // TODO - Ask Guillermo if this is included in the MVP and from which endpoint is coming from

  return (
    <>
      <DropdownButtonItem>{t('actions.editFilesMenu.options.metadata')}</DropdownButtonItem>
      {files.some((file) => file.access.restricted) && (
        <DropdownButtonItem>{t('actions.editFilesMenu.options.unrestrict')}</DropdownButtonItem>
      )}
      {files.some((file) => !file.access.restricted) && (
        <DropdownButtonItem>{t('actions.editFilesMenu.options.restrict')}</DropdownButtonItem>
      )}
      <DropdownButtonItem>{t('actions.editFilesMenu.options.replace')}</DropdownButtonItem>
      {settingsEmbargoAllowed && (
        <DropdownButtonItem>{t('actions.editFilesMenu.options.embargo')}</DropdownButtonItem>
      )}
      {provenanceEnabledByConfig && (
        <DropdownButtonItem>{t('actions.editFilesMenu.options.provenance')}</DropdownButtonItem>
      )}
      <DropdownButtonItem>{t('actions.editFilesMenu.options.delete')}</DropdownButtonItem>
    </>
  )
}
