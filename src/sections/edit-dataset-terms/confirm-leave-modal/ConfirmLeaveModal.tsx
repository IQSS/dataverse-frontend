import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './ConfirmLeaveModal.module.scss'

interface ConfirmLeaveModalProps {
  show: boolean
  onStay: () => void
  onLeave: () => void
}

export const ConfirmLeaveModal = ({ show, onStay, onLeave }: ConfirmLeaveModalProps) => {
  const { t } = useTranslation('dataset')

  return (
    <Modal show={show} onHide={onStay} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('editTerms.unsavedChangesModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <Stack direction="horizontal" gap={2} className={styles.message}>
            <ExclamationTriangle /> <span>{t('editTerms.unsavedChangesModal.message')}</span>
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onStay} type="button">
          {t('editTerms.unsavedChangesModal.stay')}
        </Button>
        <Button onClick={onLeave} type="button">
          <Stack direction="horizontal" gap={1}>
            {t('editTerms.unsavedChangesModal.leave')}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
