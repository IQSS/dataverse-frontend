import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './ConfirmLeaveModal.module.scss'

interface ConfirmLeaveModalProps {
  show: boolean
  handleCancelLeavePage: () => void
  handleConfirmLeavePage: () => Promise<void>
}

export const ConfirmLeaveModal = ({
  show,
  handleCancelLeavePage,
  handleConfirmLeavePage
}: ConfirmLeaveModalProps) => {
  const [isRemovingFiles, setIsRemovingFiles] = useState(false)
  const { t } = useTranslation('shared')

  return (
    <Modal show={show} onHide={handleCancelLeavePage} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('fileUploader.confirmLeaveModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <Stack direction="horizontal" gap={2} className={styles.message}>
            <ExclamationTriangle /> <span>{t('fileUploader.confirmLeaveModal.message')}</span>
          </Stack>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={handleCancelLeavePage}
          type="button"
          disabled={isRemovingFiles}>
          {t('fileUploader.confirmLeaveModal.stay')}
        </Button>
        <Button
          onClick={() => {
            setIsRemovingFiles(true)
            void handleConfirmLeavePage()
          }}
          type="button"
          disabled={isRemovingFiles}>
          <Stack direction="horizontal" gap={1}>
            {t('fileUploader.confirmLeaveModal.leave')}
            {isRemovingFiles && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
