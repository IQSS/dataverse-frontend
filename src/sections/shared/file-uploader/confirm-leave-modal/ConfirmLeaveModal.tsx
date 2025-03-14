import { useMemo } from 'react'
import { useBlocker } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button, Modal, Stack } from '@iqss/dataverse-design-system'
import { ExclamationTriangle } from 'react-bootstrap-icons'
import { useFileUploaderContext } from '../context/FileUploaderContext'
import styles from './ConfirmLeaveModal.module.scss'

export const ConfirmLeaveModal = () => {
  const { t } = useTranslation('shared')

  const { fileUploaderState } = useFileUploaderContext()

  const shouldBlockAwayNavigation = useMemo(() => {
    return (
      Object.keys(fileUploaderState.files).length > 0 ||
      fileUploaderState.isSaving ||
      fileUploaderState.uploadingToCancelMap.size > 0
    )
  }, [
    fileUploaderState.files,
    fileUploaderState.isSaving,
    fileUploaderState.uploadingToCancelMap.size
  ])

  const navigationBlocker = useBlocker(shouldBlockAwayNavigation)

  const handleConfirmLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      // TODO - Remove the files from the S3 bucket we need an API endpoint for this.

      // Cancel all the uploading files if there are any
      if (fileUploaderState.uploadingToCancelMap.size > 0) {
        fileUploaderState.uploadingToCancelMap.forEach((cancel) => {
          cancel()
        })
      }
      navigationBlocker.proceed()
    }
  }

  const handleCancelLeavePage = () => {
    if (navigationBlocker.state === 'blocked') {
      navigationBlocker.reset()
    }
  }

  return (
    <Modal
      show={navigationBlocker.state === 'blocked'}
      onHide={handleCancelLeavePage}
      centered
      size="lg">
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
        <Button variant="secondary" onClick={handleCancelLeavePage} type="button">
          {t('fileUploader.confirmLeaveModal.stay')}
        </Button>
        <Button onClick={handleConfirmLeavePage} type="button">
          <Stack direction="horizontal" gap={1}>
            {t('fileUploader.confirmLeaveModal.leave')}
          </Stack>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
