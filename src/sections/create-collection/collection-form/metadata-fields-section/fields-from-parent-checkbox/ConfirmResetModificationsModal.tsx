import { Alert, Button, Modal } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'

interface ConfirmResetModificationsModalProps {
  showModal: boolean
  onContinue: () => void
  onCancel: () => void
}

export const ConfirmResetModificationsModal = ({
  showModal,
  onContinue,
  onCancel
}: ConfirmResetModificationsModalProps) => {
  const { t } = useTranslation('createCollection', { keyPrefix: 'confirmResetModal' })

  return (
    <Modal show={showModal} onHide={onCancel} size="xl">
      <Modal.Header>
        <Modal.Title>{t('title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="warning" dismissible={false}>
          {t('warning')}
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onContinue} data-testid="confirm-reset-modal-continue">
          {t('continue')}
        </Button>
        <Button variant="secondary" onClick={onCancel} data-testid="confirm-reset-modal-cancel">
          {t('cancel')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
