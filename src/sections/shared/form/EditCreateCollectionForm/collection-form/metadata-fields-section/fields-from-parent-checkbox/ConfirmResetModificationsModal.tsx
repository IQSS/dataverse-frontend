import { useTranslation } from 'react-i18next'
import { Alert, Button, Modal } from '@iqss/dataverse-design-system'

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
  const { t } = useTranslation('shared', { keyPrefix: 'collectionForm.confirmResetModal' })
  const modalTitle = t('title')

  return (
    <Modal show={showModal} onHide={onCancel} size="xl" ariaLabel={modalTitle}>
      <Modal.Header>
        <Modal.Title>{modalTitle}</Modal.Title>
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
