import {
  DropdownButton,
  DropdownButtonItem,
  DropdownSeparator
} from '@iqss/dataverse-design-system'
import { useSettings } from '../../../settings/SettingsContext'
import { useEffect, useState } from 'react'
import { SettingName } from '../../../../settings/domain/models/Setting'
import { AllowedExternalStatuses } from '../../../../settings/domain/models/AllowedExternalStatuses'
import { useTranslation } from 'react-i18next'

export function ChangeCurationStatusMenu() {
  const { t } = useTranslation('dataset')
  const { getSettingByName } = useSettings()
  const [allowedExternalStatuses, setAllowedExternalStatuses] = useState<string[]>([])
  useEffect(() => {
    getSettingByName<AllowedExternalStatuses>(SettingName.ALLOWED_EXTERNAL_STATUSES)
      .then((allowedExternalStatuses) => {
        setAllowedExternalStatuses(allowedExternalStatuses.value)
      })
      .catch((error) => {
        console.error(error)
      })
  }, [getSettingByName])

  if (allowedExternalStatuses.length === 0) {
    return <></>
  }

  return (
    <DropdownButton
      id={`change-curation-status-menu`}
      title={t('datasetActionButtons.publish.changeCurationStatus')}
      variant="secondary">
      {allowedExternalStatuses.map((status) => (
        <DropdownButtonItem key={status}>{status}</DropdownButtonItem>
      ))}
      <DropdownSeparator />
      <DropdownButtonItem>
        {t('datasetActionButtons.publish.removeCurrentStatus')}
      </DropdownButtonItem>
    </DropdownButton>
  )
}
