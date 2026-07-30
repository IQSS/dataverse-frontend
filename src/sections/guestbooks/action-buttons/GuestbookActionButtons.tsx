import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ButtonGroup, Tooltip } from '@iqss/dataverse-design-system'
import { Download, Eye, Files, Pencil, Trash } from 'react-bootstrap-icons'
import { NotImplementedModal } from '@/sections/not-implemented/NotImplementedModal'

interface GuestbookActionButtonsProps {
  isEnabled: boolean
  onView: () => void
  onToggleEnabled: () => void
  onCopy?: () => void
  onEdit?: () => void
  onViewResponses?: () => void
  canToggleEnabled?: boolean
  canEdit?: boolean
  isTogglingEnabled?: boolean
  onDownloadResponses: () => void
  isDownloadingResponses?: boolean
  actionGroupClassName?: string
  toggleStatusButtonClassName?: string
}

export const GuestbookActionButtons = ({
  isEnabled,
  onView,
  onToggleEnabled,
  onCopy,
  onEdit,
  onViewResponses,
  canToggleEnabled = true,
  canEdit = true,
  isTogglingEnabled = false,
  onDownloadResponses,
  isDownloadingResponses = false,
  actionGroupClassName,
  toggleStatusButtonClassName
}: GuestbookActionButtonsProps) => {
  const { t } = useTranslation('guestbooks')
  const [showNotImplementedModal, setShowNotImplementedModal] = useState(false)

  return (
    <>
      <ButtonGroup className={actionGroupClassName} aria-label={t('table.action')}>
        {canToggleEnabled && (
          <Button
            variant="secondary"
            size="sm"
            className={toggleStatusButtonClassName}
            onClick={onToggleEnabled}
            disabled={isTogglingEnabled}>
            {isEnabled ? t('actions.disable') : t('actions.enable')}
          </Button>
        )}
        <Tooltip placement="top" overlay={t('actions.view')}>
          <Button variant="secondary" size="sm" onClick={onView} aria-label={t('actions.view')}>
            <Eye />
          </Button>
        </Tooltip>
        <Tooltip placement="top" overlay={t('actions.copy')}>
          <Button variant="secondary" size="sm" onClick={onCopy} aria-label={t('actions.copy')}>
            <Files />
          </Button>
        </Tooltip>
        {canEdit && (
          <Tooltip placement="top" overlay={t('actions.edit')}>
            <Button variant="secondary" size="sm" onClick={onEdit} aria-label={t('actions.edit')}>
              <Pencil />
            </Button>
          </Tooltip>
        )}
        <Tooltip placement="top" overlay={t('actions.downloadResponses')}>
          <Button
            variant="secondary"
            size="sm"
            onClick={onDownloadResponses}
            aria-label={t('actions.downloadResponses')}
            disabled={isDownloadingResponses}>
            <Download />
          </Button>
        </Tooltip>
        {!isEnabled && (
          <Tooltip placement="top" overlay={t('actions.delete')}>
            <Button
              variant="secondary"
              size="sm"
              // TODO: Wire this to delete guestbook once the backend endpoint is available.
              onClick={() => setShowNotImplementedModal(true)}
              aria-label={t('actions.delete')}>
              <Trash />
            </Button>
          </Tooltip>
        )}
        <Button
          variant="secondary"
          size="sm"
          onClick={onViewResponses}
          aria-label={t('actions.viewResponses')}>
          {t('actions.viewResponses')}
        </Button>
      </ButtonGroup>
      <NotImplementedModal
        show={showNotImplementedModal}
        handleClose={() => setShowNotImplementedModal(false)}
      />
    </>
  )
}
