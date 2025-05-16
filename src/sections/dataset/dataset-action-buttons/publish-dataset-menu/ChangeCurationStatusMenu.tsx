import {
  DropdownButton,
  DropdownButtonItem,
  DropdownSeparator
} from '@iqss/dataverse-design-system'
import { useSettings } from '../../../settings/SettingsContext'
import { SettingName } from '../../../../settings/domain/models/Setting'
import { AllowedExternalStatuses } from '../../../../settings/domain/models/AllowedExternalStatuses'
import { useTranslation } from 'react-i18next'
import { useNotImplementedModal } from '../../../not-implemented/NotImplementedModalContext'

export function ChangeCurationStatusMenu() {
  const { t } = useTranslation('dataset')
  const { getSettingByName } = useSettings()
  const { showModal } = useNotImplementedModal()
  const allowedExternalStatuses =
    getSettingByName<AllowedExternalStatuses>(SettingName.ALLOWED_EXTERNAL_STATUSES)?.value || []

  const handleItemClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation()
    showModal()
  }

  if (allowedExternalStatuses.length === 0) {
    return <></>
  }

  return (
    <DropdownButton
      id={`change-curation-status-menu`}
      title={t('datasetActionButtons.publish.changeCurationStatus')}
      variant="secondary">
      {allowedExternalStatuses.map((status) => (
        <DropdownButtonItem onClick={(event) => handleItemClick(event)} key={status}>
          {status}
        </DropdownButtonItem>
      ))}
      <DropdownSeparator />
      <DropdownButtonItem onClick={(event) => handleItemClick(event)}>
        {t('datasetActionButtons.publish.removeCurrentStatus')}
      </DropdownButtonItem>
    </DropdownButton>
  )
}
