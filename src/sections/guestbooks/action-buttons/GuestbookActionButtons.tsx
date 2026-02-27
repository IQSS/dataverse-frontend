import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup, Tooltip } from '@iqss/dataverse-design-system'
import { Download, Eye, Files, Pencil } from 'react-bootstrap-icons'

interface GuestbookActionButtonsProps {
  isEnabled: boolean
  onView: () => void
  actionGroupClassName?: string
  toggleStatusButtonClassName?: string
}

export const GuestbookActionButtons = ({
  isEnabled,
  onView,
  actionGroupClassName,
  toggleStatusButtonClassName
}: GuestbookActionButtonsProps) => {
  const { t } = useTranslation('guestbooks')

  return (
    <ButtonGroup className={actionGroupClassName} aria-label={t('table.action')}>
      <Button variant="secondary" size="sm" className={toggleStatusButtonClassName}>
        {isEnabled ? t('actions.disable') : t('actions.enable')}
      </Button>
      <Tooltip placement="top" overlay={t('actions.view')}>
        <Button variant="secondary" size="sm" onClick={onView} aria-label={t('actions.view')}>
          <Eye />
        </Button>
      </Tooltip>
      <Tooltip placement="top" overlay={t('actions.copy')}>
        <Button variant="secondary" size="sm" onClick={() => {}} aria-label={t('actions.copy')}>
          <Files />
        </Button>
      </Tooltip>
      <Tooltip placement="top" overlay={t('actions.edit')}>
        <Button variant="secondary" size="sm" onClick={() => {}} aria-label={t('actions.edit')}>
          <Pencil />
        </Button>
      </Tooltip>
      <Tooltip placement="top" overlay={t('actions.downloadResponses')}>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {}}
          aria-label={t('actions.downloadResponses')}>
          <Download />
        </Button>
      </Tooltip>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => {}}
        aria-label={t('actions.viewResponses')}>
        {t('actions.viewResponses')}
      </Button>
    </ButtonGroup>
  )
}
