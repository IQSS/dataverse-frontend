import { useTranslation } from 'react-i18next'
import { Button, Modal, Spinner, Stack } from '@iqss/dataverse-design-system'
import { ExclamationCircleFill, ExclamationTriangle } from 'react-bootstrap-icons'
import styles from './FileTypeDifferentModal.module.scss'

interface FileTypeDifferentModalProps {
  show: boolean
  handleContinue: () => void
  handleDeleteFile: () => void
  isDeletingFile: boolean
  errorDeletingFile: string | null
  originalFileType: string
  replacementFileType: string
}

export const FileTypeDifferentModal = ({
  show,
  handleContinue,
  handleDeleteFile,
  isDeletingFile,
  errorDeletingFile,
  originalFileType,
  replacementFileType
}: FileTypeDifferentModalProps) => {
  const { t } = useTranslation('replaceFile')
  const { t: tShared } = useTranslation('shared')

  return (
    <Modal show={show} onHide={isDeletingFile ? () => {} : handleContinue} centered size="lg">
      <Modal.Header>
        <Modal.Title>{t('fileTypeDifferentModal.title')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={2}>
          <Stack direction="horizontal" gap={2} className={styles.message}>
            <ExclamationTriangle />{' '}
            <span>
              {t('fileTypeDifferentModal.message', { originalFileType, replacementFileType })}
            </span>
          </Stack>

          {errorDeletingFile && (
            <Stack direction="horizontal" gap={2} className={`${styles.message} ${styles.error}`}>
              <ExclamationCircleFill /> <span>{errorDeletingFile}</span>
            </Stack>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={handleDeleteFile} type="button" disabled={isDeletingFile}>
          <Stack direction="horizontal" gap={1}>
            {tShared('delete')}
            {isDeletingFile && <Spinner variant="light" animation="border" size="sm" />}
          </Stack>
        </Button>
        <Button
          variant="secondary"
          onClick={handleContinue}
          type="button"
          disabled={isDeletingFile}>
          {tShared('continue')}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
